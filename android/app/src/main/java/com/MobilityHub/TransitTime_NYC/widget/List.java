package com.MobilityHub.TransitTime_NYC.widget;

import com.MobilityHub.TransitTime_NYC.R;
import com.MobilityHub.TransitTime_NYC.BuildConfig;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.widget.RemoteViews;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class List extends AppWidgetProvider {

    private static final String TAG = "ListWidget";

    @Override
    public void onEnabled(Context context) {
        Log.d(TAG, "Widget enabled");
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        Log.d(TAG, "onUpdate called");
        for (int appWidgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_list);

            // Fetch the station details from storage
            String stationDetails = getStationFromStorage(context);
            if (stationDetails != null) {
                Log.d(TAG, "Station details found: " + stationDetails);
                // Fetch train times from API
                new FetchTrainTimesTask(context, appWidgetManager, appWidgetId, views).execute(stationDetails);
            } else {
                Log.d(TAG, "No station details found");
            }
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        Log.d(TAG, "onReceive called with action: " + intent.getAction());
    }

    @Override
    public void onDisabled(Context context) {
        Log.d(TAG, "Widget disabled");
    }

    private String getStationFromStorage(Context context) {
        SharedPreferences prefs = context.getSharedPreferences("widgetPrefs", Context.MODE_PRIVATE);
        String stationDetails = prefs.getString("widgetStation", null);
        Log.d(TAG, "Retrieved station details from storage: " + stationDetails);
        return stationDetails;
    }

    private static class FetchTrainTimesTask extends AsyncTask<String, Void, JSONArray> {
        private Context context;
        private AppWidgetManager appWidgetManager;
        private int appWidgetId;
        private RemoteViews views;

        FetchTrainTimesTask(Context context, AppWidgetManager appWidgetManager, int appWidgetId, RemoteViews views) {
            this.context = context;
            this.appWidgetManager = appWidgetManager;
            this.appWidgetId = appWidgetId;
            this.views = views;
        }

        @Override
        protected JSONArray doInBackground(String... params) {
            String stationDetails = params[0];
            try {
                JSONObject stationJson = new JSONObject(stationDetails);
                String stationName = stationJson.getString("stationName");
                String lineName = stationJson.getString("lineName");
                String backendURL = BuildConfig.BACKEND_URL;
                URL url = new URL(backendURL + stationName + "&lineName=" + lineName);
                Log.d(TAG, "Fetching train times from URL: " + url.toString());
                HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
                try {
                    BufferedReader in = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
                    StringBuilder response = new StringBuilder();
                    String inputLine;
                    while ((inputLine = in.readLine()) != null) {
                        response.append(inputLine);
                    }
                    in.close();
                    Log.d(TAG, "Received response: " + response.toString());
                    return new JSONArray(response.toString());
                } finally {
                    urlConnection.disconnect();
                }
            } catch (Exception e) {
                Log.e(TAG, "Error fetching train times", e);
                return null;
            }
        }

        @Override
        protected void onPostExecute(JSONArray trainTimes) {
            if (trainTimes != null) {
                try {
                    JSONObject firstTrain = trainTimes.getJSONObject(0);
                    views.setTextViewText(R.id.widget_station_name, firstTrain.getString("stationName"));
                    views.setTextViewText(R.id.widget_line_name, firstTrain.getString("lineName"));
                    Log.d(TAG, "Updated widget views with train times");
                } catch (Exception e) {
                    Log.e(TAG, "Error updating widget views", e);
                }
                appWidgetManager.updateAppWidget(appWidgetId, views);
            } else {
                Log.d(TAG, "No train times received");
            }
        }
    }
}
