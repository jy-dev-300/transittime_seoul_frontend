import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import * as Location from 'expo-location';

interface GeolocationComponentProps {
  onLocationUpdate: (latitude: number, longitude: number) => void; // New prop type
  refreshLocation: () => void;
}

const GeolocationComponent: React.FC<GeolocationComponentProps> = ({ onLocationUpdate }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to fetch location
  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;

      // Call the prop function to pass the location back to the parent
      onLocationUpdate(latitude, longitude);
      setError(null);
    } catch (err) {
      setError('Error getting location: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation(); // Fetch the location when the component mounts
  }, [onLocationUpdate]);

  // Function to refresh location on demand
  const refreshLocation = () => {
    setLoading(true);
    getLocation();
  };

  return (
    <View style={{ padding: 15}}>
      {loading ? (
        <Text style={{ fontSize: 18, color: '#333333' }}>위치 찾는중이에요...</Text>
      ) : error ? (
        <Text style={{ color: 'red' }}>Error: {error}</Text>
      ) : (
        <Text style={{ fontSize: 18, color: '#333333' }}>근처 역👇</Text>
      )}
    </View>
  );
};

export default GeolocationComponent;
