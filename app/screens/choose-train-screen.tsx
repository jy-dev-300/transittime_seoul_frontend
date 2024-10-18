import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg'; // Import for SVG support
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';


interface TrainInfo {
  stationName: string;
  lineName: string;
  trainType: string;
  direction: string;
  arrivalTime: string;
}

const ChooseTrainScreen: React.FC = () => {
  const [trains, setTrains] = useState<TrainInfo[]>([]); // Initialize as an array of TrainInfo objects
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { stationName, lineName } = useLocalSearchParams();

  // Fetch train info from API
  const fetchTrainsInfo = async (stationName: string | string[], lineName: string | string[]) => {
    try {
      console.log(stationName + " <-- this station name was received by the ChooseTrainScreen");
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_API_URL}/api/routes/arrivalTimes?stationName=${stationName}&lineName=${lineName}`);
      const trainsInfo = await response.json();
      console.log('Train info was received from Seoul City Government:', trainsInfo);
      return trainsInfo; // Assuming trainsInfo is a list of dicts
    } catch (error) {
      console.log('Error fetching arrival time data.');
      return [];
    }
  };

  // UseEffect to fetch train info on component mount
  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching train info for:", stationName, lineName);
      const trainsInfo = await fetchTrainsInfo(stationName, lineName);
      if (trainsInfo && Array.isArray(trainsInfo)) {
        setTrains(trainsInfo as TrainInfo[]); // Update state with fetched train info
      }
    };
    fetchData();
  }, [stationName, lineName]);

  // Function to handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    const trainsInfo = await fetchTrainsInfo(stationName, lineName);
    if (trainsInfo && Array.isArray(trainsInfo)) {
      setTrains(trainsInfo as TrainInfo[]);
    }
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.stationList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        bounces={true}
        overScrollMode="always"
      >

        {/* Render each train entry */}
        {trains.map((train, index) => (
          <TouchableOpacity
            key={`${train.stationName}-${train.lineName}-${index}`} // Make the key more unique
            style={styles.stationButton}
            onPress={() => {
              console.log(`${train.stationName}, ${train.lineName} was pressed.`);
              router.push({
                pathname: '/screens/choose-line-screen',
                params: { stationName: train.stationName, lineName: train.lineName }, // Pass station and line names as parameters
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
                y="20%" // Adjusted y-position for station name
                textAnchor="middle"
                alignmentBaseline="middle"
                fontWeight="bold"
              >
                {train.stationName}
              </SvgText>

              {/* Line Name */}
              <SvgText
                fill="#FF5733" // Different color for line name
                fontSize="18"
                x="50%"
                y="40%" // Adjusted y-position for line name
                textAnchor="middle"
                alignmentBaseline="middle"
                fontStyle="italic"
              >
                {train.lineName}
              </SvgText>

              {/* Train Type */}
              <SvgText
                fill="#4682B4" // Different color for train type
                fontSize="16"
                x="50%"
                y="60%" // Adjusted y-position for train type
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {train.trainType}
              </SvgText>

              {/* Direction */}
              <SvgText
                fill="#000000"
                fontSize="16"
                x="50%"
                y="75%" // Adjusted y-position for direction
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {train.direction}
              </SvgText>

              {/* Time Remaining */}
              <SvgText
                fill="#000000"
                fontSize="16"
                x="50%"
                y="90%" // Adjusted y-position for time remaining
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {train.arrivalTime} 분
              </SvgText>
            </Svg>
          </TouchableOpacity>
        ))}
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
    height: 100,
  },
});

export default ChooseTrainScreen;
