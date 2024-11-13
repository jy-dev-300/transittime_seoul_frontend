package com.MobilityHub.TransitTime_Seoul.widget;

import com.MobilityHub.TransitTime_Seoul.R;
import com.MobilityHub.TransitTime_Seoul.BuildConfig;
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
import com.MobilityHub.TransitTime_Seoul.utility.NetworkUtils;
import com.MobilityHub.TransitTime_Seoul.utility.TrainLogoUtils;
import android.widget.TextView;
import java.util.ArrayList;

public class List extends AppWidgetProvider {

    private static final String TAG = "ListWidget";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        Log.d(TAG, "onUpdate called");
        for (int appWidgetId : appWidgetIds) {
            Intent intent = new Intent(context, ListWidgetService.class);
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_list);
            views.setRemoteAdapter(R.id.widget_list_view, intent);

            String stationDetails = getStationFromStorage(context);
            if (stationDetails != null) {
                new FetchTrainTimesTask(context, appWidgetManager, appWidgetId, views).execute(stationDetails);
            }

            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }

    private String getStationFromStorage(Context context) {
        SharedPreferences prefs = context.getSharedPreferences("widgetPrefs", Context.MODE_PRIVATE);
        String stationName = prefs.getString("stationName", null);
        String lineName = prefs.getString("lineName", null);
        if (stationName != null && lineName != null) {
            JSONObject stationDetails = new JSONObject();
            try {
                stationDetails.put("stationName", stationName);
                stationDetails.put("lineName", lineName);
            } catch (Exception e) {
                Log.e(TAG, "Error retrieving station details", e);
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
                JSONArray result = NetworkUtils.fetchArrivalTimes(stationName, lineName, backendURL);
                Log.d(TAG, "Fetched train timesff: " + result.toString());
                return result;
            } catch (Exception e) {
                Log.e(TAG, "Error fetching train times", e);
                return null;
            }
        }

        @Override
        protected void onPostExecute(JSONArray trainTimes) {
            if (trainTimes != null && trainTimes.length() > 0) {
                ListRemoteViewsFactory.updateData(trainTimes);
                appWidgetManager.notifyAppWidgetViewDataChanged(appWidgetId, R.id.widget_list_view);
                appWidgetManager.updateAppWidget(appWidgetId, views);
            } else {
                Log.d(TAG, "선택한 역에 운행중인 열차가 없습니다.");
            }
        }
    }
}
