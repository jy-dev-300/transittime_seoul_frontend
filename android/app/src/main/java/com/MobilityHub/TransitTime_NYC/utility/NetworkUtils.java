package com.MobilityHub.TransitTime_NYC.utility;

import android.util.Log;
import org.json.JSONArray;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

public class NetworkUtils {
    public static JSONArray fetchArrivalTimes(String stationName, String lineName, String backendURL) {
        try {
            String urlString = String.format("%s/api/routes/arrivalTimes?stationName=%s&lineName=%s", backendURL, stationName, lineName);
            URL url = new URL(urlString);
            HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
            urlConnection.setRequestMethod("GET");
            urlConnection.setRequestProperty("Content-Type", "application/json");

            InputStream inputStream = urlConnection.getInputStream();
            Scanner scanner = new Scanner(inputStream);
            scanner.useDelimiter("\\A");
            String response = scanner.hasNext() ? scanner.next() : "";
            scanner.close();

            return new JSONArray(response);
        } catch (Exception e) {
            Log.e("NetworkUtils", "Error fetching data", e);
            return null;
        }
    }
}