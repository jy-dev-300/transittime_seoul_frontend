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
import android.content.ComponentName;
import com.MobilityHub.TransitTime_NYC.utility.NetworkUtils;


public class List extends AppWidgetProvider {

    private static final String TAG = "ListWidget";

    @Override
    public void onEnabled(Context context) {
        super.onEnabled(context);
        Log.d(TAG, "Widget enabled");
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        Log.d(TAG, "onUpdate called");
        for (int appWidgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_list);
            Log.d(TAG, "RemoteViews created");

            // Fetch the station details from SharedPreferences
            String stationDetails = getStationFromStorage(context);
            Log.d(TAG, "stationDetails from getStationFromStorage in List.java: " + stationDetails);
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
        Log.d(TAG, "Expected action: " + AppWidgetManager.ACTION_APPWIDGET_UPDATE + "and intent.getAction() is: " + intent.getAction());
        // if (AppWidgetManager.ACTION_APPWIDGET_UPDATE.equals(intent.getAction())) {
        //     AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        //     ComponentName thisAppWidget = new ComponentName(context.getPackageName(), List.class.getName());
        //     int[] appWidgetIds = appWidgetManager.getAppWidgetIds(thisAppWidget);
        //     onUpdate(context, appWidgetManager, appWidgetIds);
        // }
    }

    @Override
    public void onDisabled(Context context) {
        super.onDisabled(context);
        Log.d(TAG, "Widget disabled");
    }

    private String getStationFromStorage(Context context) {
        SharedPreferences prefs = context.getSharedPreferences("widgetPrefs", Context.MODE_PRIVATE);
        Log.d(TAG, "Retrieved shared preferences: " + prefs);
        String stationName = prefs.getString("stationName", null);
        String lineName = prefs.getString("lineName", null);
        Log.d(TAG, "Retrieved station details from storage: " + stationName + " " + lineName);
        if (stationName != null && lineName != null) {
        JSONObject stationDetails = new JSONObject(); //this JSON object is used to pass the station name and line name to the FetchTrainTimesTask
        try {
            stationDetails.put("stationName", stationName);
            stationDetails.put("lineName", lineName);
        } catch (Exception e) {
            Log.e(TAG, "Error retrieving station details from storage (storage is SharedPreferencesModule.java)", e);
        }
        return stationDetails.toString();
    }
    return null;
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
                JSONArray response = NetworkUtils.fetchArrivalTimes( stationName,  lineName,  backendURL);
                return response;
            } catch (Exception e) {
                Log.e(TAG, "Error fetching train times", e);
                return null;
            }
        }

        @Override
        protected void onPostExecute(JSONArray trainTimes) {
            String allTrainsString = "";
            if (trainTimes != null) {
                try {
                    Log.d(TAG, "This is ultimately data that can be brought to widget UI: " + trainTimes.toString());
                    JSONObject train = trainTimes.getJSONObject(0);
                    views.setTextViewText(R.id.widget_station_name, train.getString("stationName"));

                    for (int i = 0; i < trainTimes.length(); i++) {
                        JSONObject currentTrain = trainTimes.getJSONObject(i);
                        allTrainsString += currentTrain.getString("direction") + "\n";
                        allTrainsString += currentTrain.getString("typeOfTrain") + "\n";
                        allTrainsString += currentTrain.getString("arrivalTime") + "\n";

                        // Conditional logo display for line name
                        String lineNumber = currentTrain.getString("lineNumber");
                        int trainLogo = TrainLogoUtils.getLogoResourceId(lineNumber);
                        views.setImageViewResource(R.id.widget_line_name, trainLogo);

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
