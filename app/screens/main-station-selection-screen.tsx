import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Alert } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg'; // Import for SVG support
import { useRouter } from 'expo-router';
import axios from 'axios';
import GeolocationComponent from '../components/GeolocationComponent'; // Adjust the path as necessary
import { findNearestStation } from '../services/locationService';
import station_locs from '../../assets/stations_locs.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules } from 'react-native'; // Import NativeModules
const { WidgetUpdater } = NativeModules; // Access the WidgetUpdater module
import { getLogoResource } from '../services/trainLogosService'; // Adjust the path as necessary
const { SharedPreferencesModule } = NativeModules;
//State management

//Screen component definition
//useEffect():
//this is where you fetch from API

//JSX Layout
//Defines UI Structure
// Define navigation types

//when user enters this page, initial stations should be populated with
//initialStations = lines_near_user_location

const initialStations = [];
//list of stations from user location info

//placeholder atm
const MainStationSelection: React.FC = () => {
  const [stations, setStations] = useState(initialStations); // Store stations in state, state of stations is set to initialStations
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter(); //router.push(rel path to dest screen) relative wrt to 'app'

  // State for latitude and longitude
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Callback function to receive location from GeolocationComponent
  const handleLocationUpdate = async (latitude: number, longitude: number) => {
    // Only update location and fetch stations if they have changed
    if (!location || location.latitude !== latitude || location.longitude !== longitude) {
    setLocation({ latitude, longitude });
    
    // Fetch nearest stations
    const nearestStations = await findNearestStation(latitude, longitude, station_locs);
    setStations(nearestStations); // Update the state with the fetched stations
    console.log(nearestStations);
  }
  };

  const refreshLocation = async () => {
    if (location) {
      await handleLocationUpdate(location.latitude, location.longitude);
      console.log('Location refreshed');
    }
  };
  
  //as soon as screen loads we want to call the api (just for testing)
  const onRefresh = () => {
    setRefreshing(true);
    refreshLocation(); // Call to refresh location
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleScroll = (event) => {
    const pullDistance = event.nativeEvent.contentOffset.y;
    if (pullDistance < -100 && !refreshing) {  // Threshold of -100px before triggering refresh
      onRefresh();
    }
  };

  const saveStationToWidget = async (stationName: string, lineName: string) => {
    try {
      SharedPreferencesModule.saveStation(stationName, lineName);
      console.log('Station saved to SharedPreferences');
      WidgetUpdater.updateWidget(); // Trigger widget update
    } catch (error) {
      console.error('Error saving station to widget:', error);
    }
  };

  const handleLongPress = (stationName: string, lineName: string) => {
    Alert.alert(
      "Add to Widget",
      `Do you want to add ${stationName} to the widget?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            saveStationToWidget(stationName, lineName);
            alert(`${stationName} added to widget`);
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <GeolocationComponent onLocationUpdate={handleLocationUpdate} refreshLocation={refreshLocation} />
      {/* Scrollable List of Stations */}
      <ScrollView
        contentContainerStyle={styles.stationList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        bounces={true}
        overScrollMode="always"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {stations.map((station, index) => {
          const [stationName, lineName] = station.station_name.split('++++');
          const LineIcon = getLogoResource(lineName);
          const distance = station.distance.toFixed(2); // Format distance to two decimal places

          return (
            <TouchableOpacity
              key={index}
              style={styles.stationButton}
              onLongPress={() => handleLongPress(stationName, lineName)}
              onPress={() => {
                console.log(stationName, lineName + " was pressed at the main station screen");
                router.push({
                  pathname: '/screens/choose-train-screen',
                  params: { stationName, lineName },
                });
              }}
            >
              <View style={styles.horizontalContainer}>
                {LineIcon && (
                  <View style={{ justifyContent: 'center', alignItems: 'center', width: 24, height: 24, marginLeft: 20 }}>
                    <LineIcon />
                  </View>
                )}
                <View style={styles.textContainer}>
                  <Text style={styles.stationName}>{stationName}</Text>
                </View>
                <View style={styles.distanceContainer}>
                  <Text style={styles.stationDistance}>{distance} km</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Manually Choose a Station Button */}
      <TouchableOpacity
        style={styles.manualButton}
        onPress={() => router.push('/screens/manual-station-selection-screen')}
      >
        <Text style={styles.manualButtonText}>🔍검색</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  stationList: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  stationButton: {
    marginBottom: 20,
    width: '100%',
    height: 80, // Adjust the height as needed
    flexDirection: 'row',
    alignItems: 'center', // Center children vertically
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Ensure the container takes full width
  },
  textContainer: {
    marginLeft: 20,
    flex: 1, // Allow text to take available space
    justifyContent: 'center', // Center text vertically within its container
  },
  distanceContainer: {
    justifyContent: 'center', // Center the distance text vertically
    alignItems: 'flex-end', // Align the distance text to the right
  },
  stationName: {
    fontSize: 22,
    textAlign: 'center', // Center text horizontally within the text container
    color: '#333333',
  },
  stationDistance: {
    fontSize: 16,
    color: '#555',
    marginRight: 20,
  },
  manualButton: {
    position: 'absolute',
    alignSelf: 'flex-end',
    top: 35, // Adjust this value to move the button up
    right: 20,
    paddingHorizontal: 10,
  },
  manualButtonText: {
    fontSize: 18,
    color: '#333333',
  },
});

export default MainStationSelection;
