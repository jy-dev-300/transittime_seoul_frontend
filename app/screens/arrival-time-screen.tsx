import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg'; // Import for SVG support
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';



const ArrivalTimeScreen: React.FC = () => {
  const [lineData, setLineData] = useState<{ stationName: string; lineName: string; timeRemaining: string } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const {stationName, lineName} = useLocalSearchParams();


  //https://gimpogoldline.com/?page_id=484
  //if lineName = 김포골드, use assets/gimpo_goldline_time_chart_airport or _gurae
  //timeRemaining = findSoonestArrivalTime(stationName, userDay, userTime, gimpo_goldline_time_tables)

  const fetchTrainInfo = async (stationName: string | string[], lineName: string| string[]) => {
    try {
      console.log(stationName+" <-- this station name was received by the arrivaltimescreen from mainscreen");
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_API_URL}/api/routes/arrivalTimes?stationName=${stationName}&lineName=${lineName}`); //this is how you pass query params via url to backend
      const trainInfo = await response.json();
      console.log(`Trains info was received from Seoul City Government`);
    } catch (error) {
      console.log('There was an error in running the fetchArrivalTimeData method, perhaps due to a bad api url, env issues, or stationname/linename were not properly sent in from the main screen.');
    }
  };

  useEffect(() => {
    fetchTrainInfo(stationName, lineName); // Fetch data when component mounts
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTrainInfo(stationName, lineName); // Refresh data
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {lineData && (
          <>
            {/* Arrival Time Partition */}
            <View style={styles.partition}>
              <Text style={styles.timeText}>
                {lineData.timeRemaining.toUpperCase()}
              </Text>
            </View>

            {/* Station Name Partition */}
            <View style={styles.partition}>
              <Text style={styles.stationText}>
                {lineData.stationName.toUpperCase()}
              </Text>
            </View>

            {/* Line Name Partition */}
            <View style={styles.partition}>
              <Text style={styles.lineText}>
                {lineData.lineName.toUpperCase()}
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partition: {
    width: '100%',
    paddingVertical: 40,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#ff6347', // Use a bold color for the time remaining
  },
  stationText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333', // Darker color for station name
  },
  lineText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#4682b4', // Different color for line name
  },
});

export default ArrivalTimeScreen;
