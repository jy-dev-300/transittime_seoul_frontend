import React, {useEffect, useState} from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg'; // Import for SVG support
import { useRouter } from 'expo-router';
import axios from 'axios';
import GeolocationComponent from '../components/GeolocationComponent'; // Adjust the path as necessary
import { findNearestStation } from '../services/locationService';
import station_locs from '../../assets/stations_locs.json';

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
          // Assuming station_name is formatted as "StationName (LineName)"
          const [stationName, lineName] = station.station_name.split('++++');

          return (
            <TouchableOpacity
              key={index}
              style={styles.stationButton}
              onPress={() => {
                 // Assuming line_name is part of the station object
                console.log(stationName, lineName + " was pressed at the main station screen")
                router.push({
                  pathname: '/screens/choose-train-screen',
                  params: { stationName, lineName }, // Pass stationName and lineName as parameters
                });
              }}
            >
              <Svg width="100%" height="100" viewBox="0 0 412 100" fill="none">
                <Rect width="100%" height="100%" fill="#e0e0e0" />

                {/* Station Name */}
                <SvgText
                  fill="#000000"
                  fontSize="24"
                  x="50%"
                  y="40%" // Adjusted y-position for station name
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontWeight="bold"
                >
                  {stationName}
                </SvgText>

                {/* Line Name */}
                <SvgText
                  fill="#FF5733" // Different color for line name
                  fontSize="18" // Smaller font size for line name
                  x="50%"
                  y="65%" // Adjusted y-position for line name
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontStyle="italic"
                >
                  {lineName}
                </SvgText>
              </Svg>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Manually Choose a Station Button */}
      <TouchableOpacity
        style={styles.manualButton}
        onPress={() => router.push('/screens/manual-station-selection-screen')}
      >
        <Svg width="100%" height="100" viewBox="0 0 412 100" fill="none">
          <Rect width="100%" height="100%" fill="#d3d3d3" />
          <SvgText
            fill="#000000"
            fontSize="24"
            x="50%"
            y="50%"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            Manually Choose a Station
          </SvgText>
        </Svg>
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
    height: 100,
  },
  manualButton: {
    width: '100%',
    height: 100,
    backgroundColor: '#d3d3d3',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainStationSelection;