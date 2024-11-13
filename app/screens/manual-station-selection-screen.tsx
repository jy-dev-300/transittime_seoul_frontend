import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getLogoResource } from '../services/trainLogosService'; // Adjust the path as necessary
import stationData from '../../assets/stations_locs.json';
import { NativeModules } from 'react-native'; // Import NativeModules

const { SharedPreferencesModule, WidgetUpdater } = NativeModules; // Access the SharedPreferencesModule and WidgetUpdater

// Define a type for the station data
type Station = {
  outStnNum: string;
  stnKrNm: string;
  lineNm: string;
  convX: string;
  convY: string;
};

const ManualStationSelection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Filter stations based on search query
  const filteredStations = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const normalizedQuery = searchQuery.toLowerCase().replace(/\s+/g, '');
    return stationData.filter((station: Station) =>
      station.stnKrNm.toLowerCase().replace(/\s+/g, '').includes(normalizedQuery)
    );
  }, [searchQuery]);

  // Function to save station to widget
  const saveStationToWidget = async (stationName: string, lineName: string) => {
    try {
      SharedPreferencesModule.saveStation(stationName, lineName);
      console.log('Station saved to SharedPreferences');
      WidgetUpdater.updateWidget(); // Trigger widget update
    } catch (error) {
      console.error('Error saving station to widget:', error);
    }
  };

  // Function to handle long press
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
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="역 이름을 검색해보세요"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      {/* Scrollable List of Stations */}
      <ScrollView
        contentContainerStyle={styles.stationList}
        bounces={true}
        overScrollMode="always"
        scrollEventThrottle={16}
      >
        {filteredStations.map((station: Station, index) => {
          const LineIcon = getLogoResource(station.lineNm);

          return (
            <TouchableOpacity
              key={`${station.stnKrNm}-${station.lineNm}-${index}`}
              style={styles.stationButton}
              onLongPress={() => handleLongPress(station.stnKrNm, station.lineNm)}
              onPress={() => {
                console.log(`${station.stnKrNm}, ${station.lineNm} was pressed.`);
                router.push({
                  pathname: '/screens/choose-train-screen',
                  params: { stationName: station.stnKrNm, lineName: station.lineNm },
                });
              }}
            >
              <View style={styles.horizontalContainer}>
                {LineIcon && (
                  <View style={styles.iconContainer}>
                    <LineIcon />
                  </View>
                )}
                <View style={styles.textContainer}>
                  <Text style={styles.stationName}>{station.stnKrNm}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
    marginLeft: 20,
  },
  textContainer: {
    marginLeft: 0,
    flex: 1, // Allow text to take available space
    justifyContent: 'center', // Center text vertically within its container
  },
  stationName: {
    fontSize: 22,
    textAlign: 'center', // Center text horizontally within the text container
    color: '#333333',
  },
  searchBar: {
    height: 60,
    borderColor: '#d3d3d3',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 30,
    borderRadius: 8,
    fontSize: 18,
  },
});

export default ManualStationSelection;

//Custom logic--additional custom logic
