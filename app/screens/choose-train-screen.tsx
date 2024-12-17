import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Image } from 'react-native';
import Svg, { Rect } from 'react-native-svg'; // Import for SVG support
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { getLogoResource } from '../services/trainLogosService'; // Adjust the path as necessary

interface TrainInfo {
  stationName: string;
  lineName: string;
  typeOfTrain: string;
  direction: string;
  arrivalTime: string;
  arvlMsg2: string;
  arvlCd: string;
  arvlMsg3: string;
}

const ChooseTrainScreen: React.FC = () => {
  const [trains, setTrains] = useState<TrainInfo[]>([]); // Initialize as an array of TrainInfo objects
  const [refreshing, setRefreshing] = useState(false);
  const { stationName, lineName } = useLocalSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Add state for error message
  const LineIcon = getLogoResource(Array.isArray(lineName) ? lineName[0] : lineName); // Ensure this returns a valid ImageSourcePropType

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
      if (trainsInfo === null) { // Check if trainsInfo is null
        //setErrorMessage("아직 이 역 정보는 준비 중이에요!" + "\n" + "곧 추가될 예정이니 기다려 주셔서 감사합니다~ 😊");
        setTrains([]); // Clear trains if null
      } else if (trainsInfo && Array.isArray(trainsInfo)) {
        const updatedTrains = trainsInfo.map(train => {
          const cleanedDirection = train.direction
            .replace(/\s*\(?(급행|일반)\)?/g, '') // Remove "급행", "일반", and any surrounding whitespace
            .replace(/\s*\(\s*\)/g, '') // Remove empty parentheses with optional whitespace
            .trim(); // Trim any leading or trailing whitespace
          return {
            ...train,
            direction: cleanedDirection,
          };
        });
        setTrains(updatedTrains as TrainInfo[]);
        setErrorMessage(null); // Clear error message if data is received
      }
    };
    fetchData();
  }, [stationName, lineName]);

  // Function to handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    const trainsInfo = await fetchTrainsInfo(stationName, lineName);
    if (trainsInfo && Array.isArray(trainsInfo)) {
      const updatedTrains = trainsInfo.map(train => ({
        ...train,
        direction: train.direction
          .replace(/\s*\(?(급행|일반)\)?/g, '') // Remove "급행", "일반", and any surrounding whitespace
          .replace(/\s*\(\s*\)/g, '') // Remove empty parentheses with optional whitespace
          .trim(), // Trim any leading or trailing whitespace
      }));
      setTrains(updatedTrains as TrainInfo[]);
    }
    setRefreshing(false);
  };

  // Check if it's after 1 a.m.
  const isAfterServiceHours = () => {
    const currentHour = new Date().getHours();
    return currentHour >= 1 && currentHour <= 4;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.stationList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        bounces={true}
        overScrollMode="always"
      >
        {isAfterServiceHours() ? (
          <Text style={styles.serviceOverMessage}>
            지하철 운행이 끝나서, 앱 서비스 마감입니다.
            {"\n"}App service is over for today, as most subway services have stopped.
          </Text>
        ) : (
          trains.length === 0 ? (
            <View>
              <TouchableOpacity style={styles.stationButton}>
                <View style={styles.horizontalContainer}>
                  <View style={styles.iconContainer}>
                    {getLogoResource(Array.isArray(lineName) ? lineName[0] : lineName) && (
                      React.createElement(getLogoResource(Array.isArray(lineName) ? lineName[0] : lineName))
                    )}
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.stationName}>{stationName}</Text>
                  </View>
                  <View style={styles.timeContainer}>
                    <Text style={styles.arrivalTime}>정보없음</Text> 
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            trains.map((train, index) => {
              const LineIcon = getLogoResource(Array.isArray(lineName) ? lineName[0] : lineName);

              // Extract number from arvlMsg2 if it contains brackets
              const bracketMatch = train.arvlMsg2.match(/\[(\d+)\]/);
              const numberInBrackets = bracketMatch ? bracketMatch[1] : null;

              // Combined logic for formatted message
              const formattedMessage = (() => {
                if (train.arvlMsg2.includes("전역 도착")) {
                  return "전역" + "\n" + "도착";
                } else if (train.arvlMsg2.includes("전역 진입")) {
                  return "전역" + "\n" + "진입";
                } else if (train.arvlMsg2.includes("전역 출발")) {
                  return "전역" + "\n" + "출발";
                } else if (train.arvlMsg2.includes("도착") && 
                           train.arvlMsg2.replace("도착", "").trim() === train.stationName) {
                  return "도착";
                } else if (train.arvlMsg2.includes("출발") && 
                           train.arvlMsg2.replace("출발", "").trim() === train.stationName) {
                  return "출발";
                } else if (train.arvlMsg2.includes("진입") && 
                           train.arvlMsg2.replace("진입", "").trim() === train.stationName) {
                  return "진입";
                } 
                return null; // Return null if no conditions match
              })();

              return (
                <TouchableOpacity
                  key={`${train.stationName}-${train.lineName}-${index}`} // Make the key more unique
                  style={styles.stationButton}
                >
                  <View style={styles.horizontalContainer}>
                    {LineIcon && (
                      <View style={styles.iconContainer}>
                        <LineIcon />
                      </View>
                    )}
                    <View style={styles.textContainer}>
                      <Text style={styles.stationName}>{train.stationName}</Text>
                      <Text style={styles.direction}>{train.direction}</Text>
                      <Text
                        style={[
                          styles.typeOfTrain,
                          train.typeOfTrain === "급행" && styles.expressTrainType, // Conditional style
                        ]}
                      >
                        {train.typeOfTrain}
                      </Text>
                    </View>
                    <View style={styles.timeContainer}>
                      {train.arrivalTime === "0" ? (
                        <View style={styles.arrivalTime}>
                          {numberInBrackets && (
                            <Text style={styles.arrivalTimeNumber}>{numberInBrackets} 역</Text>
                          )}
                          {numberInBrackets && <Text style={styles.arrivalTimeSuffix}>남음</Text>}
                          {formattedMessage && (
                            <Text style={styles.formattedArrivalMessage}>{formattedMessage}</Text>
                          )}
                        </View>
                      ) : (
                        <Text style={styles.arrivalTime}>{train.arrivalTime} 분</Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          ) // Closing for trains.length === 0
        ) // Closing for isAfterServiceHours
      }
        {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
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
    height: 150, // Adjust the height as needed
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
    marginLeft: 20,
    flex: 1, // Allow text to take available space
    justifyContent: 'center', // Center text vertically within its container
  },
  timeContainer: {
    justifyContent: 'center', // Center the time text vertically
    alignItems: 'flex-end', // Align the time text to the right
  },
  stationName: {
    fontSize: 24,
    textAlign: 'center', // Center text horizontally within the text container
    color: '#333333',
  },
  direction: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center', // Center text horizontally within the text container
  },
  typeOfTrain: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center', // Center text horizontally within the text container
  },
  expressTrainType: {
    color: 'red', // Red color for express trains
  },
  arrivalTime: {
    fontSize: 20,
    color: '#1760e8',
    marginRight: 20,
  },
  arrivalTimeNumber: {
    fontSize: 20,
    color: '#1760e8',
    textAlign: 'center',
  },
  arrivalTimeSuffix: {
    fontSize: 20,
    color: '#1760e8',
    textAlign: 'center',
  },
  formattedArrivalMessage: {
    fontSize: 20, // Adjust this size to be slightly smaller than the main arrival time
    color: '#1760e8',
    textAlign: 'center',
  },
  errorMessage: {
    marginTop: 300,
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
  },
  serviceOverMessage: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default ChooseTrainScreen;
