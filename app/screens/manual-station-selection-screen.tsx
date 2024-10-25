import React, {useState, useMemo} from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, RefreshControl } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg'; // Import for SVG support
import { useRouter } from 'expo-router';
import Autocomplete from 'react-native-autocomplete-input';
import stationData from '../../assets/allLinesAtEachStation.json';

// Define a type for the station data
type Station = {
  outStnNum: string;
  stnKrNm: string;
  lineNm: string;
  convX: string;
  convY: string;
};

//State management

//Screen component definition
//useEffect():
//this is where you fetch from API

//JSX Layout
//Defines UI Structure
// Define navigation types

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
      <ScrollView 
        contentContainerStyle={styles.stationList}
        bounces={true}
        overScrollMode='always'
        scrollEventThrottle={16}
      >
        {filteredStations.map((station: Station, index) => (
          <TouchableOpacity
            key={`${station.stnKrNm}-${station.lineNm}-${index}`}
            style={styles.stationButton}
            onPress={() => {
              console.log(`${station.stnKrNm}, ${station.lineNm} was pressed.`);
              router.push({
                pathname: '/screens/choose-train-screen',
                params: { stationName: station.stnKrNm, lineName: station.lineNm },
              });
            }}
          >
            <Svg width="100%" height="100" viewBox="0 0 412 100" fill="none">
              <Rect width="100%" height="100%" fill="#e0e0e0" />
              <SvgText
                fill="#000000"
                fontSize="24"
                x="50%"
                y="40%"
                textAnchor="middle"
                alignmentBaseline="middle"
                fontWeight="bold"
              >
                {station.stnKrNm}
              </SvgText>
              <SvgText
                fill="#FF5733"
                fontSize="18"
                x="50%"
                y="65%"
                textAnchor="middle"
                alignmentBaseline="middle"
                fontStyle="italic"
              >
                {station.lineNm}
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
