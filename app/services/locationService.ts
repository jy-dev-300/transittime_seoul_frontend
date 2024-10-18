export const haversineDistance =(user_lat, user_long, station_lat, station_lon) => {
    const toRadians = angle => (angle * Math.PI) / 180;

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(station_lat - user_lat);
    const dLon = toRadians(station_lon - user_long);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(user_lat)) * Math.cos(toRadians(station_lat)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in kilometers
    return distance;
}

interface StationLocation {
  outStnNum: string; // Station number
  stnKrNm: string; // Korean name of the station
  lineNm: string; // Korean name of line
  convY: string; // Latitude
  convX: string; // Longitude
}


export const findNearestStation = async (
    user_lat: number,
    user_long: number,
    stations_locs: StationLocation[]
    ): Promise<{ station_name: string; distance: number }[]> => {
    const distances_dict: { [key: string]: number } = {};

    // Check if there are no station locations provided
    if (stations_locs.length === 0) {
        return []; // Return an empty array if no stations are available
    }

    console.log(`The users lat, lon are ${user_lat}, ${user_long}`);
  
    for (const station of stations_locs as StationLocation[]) {
      const station_lat = parseFloat(station.convY as string);
      const station_lon = parseFloat(station.convX as string);
      // Assuming haversineDistance is a function that calculates distance
      const station_key = `${station.stnKrNm}++++${station.lineNm}`
      distances_dict[station_key] = haversineDistance(user_lat, user_long, station_lat, station_lon);
    }
  
    // this is a helper function to be used only by findNearestStation
    // Find the nearest station (station will come with a line number so there might be the same station with different lines. i.e closest 3 statoins might be gimpo air gimpo air gimpo air , 3 diff lines same station)
    // For now lets just use Station + Line as one stationitem, and see how it affects use case. 
    const getNearestStations = (distances_dict: { [key: string]: number }): { station_name: string; distance: number }[] => {
        const nearestStations = Object.entries(distances_dict)
          .map(([station_name, distance]) => ({ station_name, distance })) // Convert entries to objects
          .sort((a, b) => a.distance - b.distance) // Sort by distance in ascending order
          .slice(0, 5); // Get the nearest five stations
      
        return nearestStations; // Return the array of nearest stations
      };
      
    return getNearestStations(distances_dict);
};