import React, {useState} from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, RefreshControl } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg'; // Import for SVG support
import { useRouter } from 'expo-router';
import Autocomplete from 'react-native-autocomplete-input';

//State management

//Screen component definition
//useEffect():
//this is where you fetch from API

//JSX Layout
//Defines UI Structure
// Define navigation types
const initialStations = ["Pungmu Station", "MANUAL 2", "Station 3", "Station 4", "Station 5", "Station 6", "Station 7"];
// initial stations are list of names in stations_loc
// then for each name, look in stations_loc then get 


const ManualStationSelection: React.FC = () => {
  const [stations, setStations] = useState(initialStations); // Store stations in state, state of stations is set to initialStations
  const [searchQuery, setSearchQuery] = useState(''); // For the search query
  const router = useRouter(); //router.push(rel path to dest screen) relative wrt to 'app'

  const filteredStations = stations.filter(station =>
    station.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search for a station..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      {/* Scrollable List of Stations */}
      <ScrollView contentContainerStyle={styles.stationList} 
                  bounces={true} // bouncy/stretchy overscroll on iOS
                  //stretchy overscroll on Android
                  overScrollMode='always'
                  //play with scroll event throttle quantity
                  scrollEventThrottle={160}> 
        {stations.map((station, index) => (
          <TouchableOpacity key={index} style={styles.stationButton} 
          onPress={() => 
            
            router.push('/screens/choose-line-screen')

          }>
            <Svg width="100%" height="100" viewBox="0 0 412 100" fill="none">
              <Rect width="100%" height="100%" fill="#e0e0e0" />
              <SvgText
                fill="#000000"
                fontSize="24"
                x="50%"
                y="50%"
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {station}
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
  manualButton: {
    width: '100%',
    height: 100,
    backgroundColor: '#d3d3d3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 8,
  },
});


export default ManualStationSelection;

//Custom logic--additional custom logic