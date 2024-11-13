//Supplies data to each item in the ListView, creating RemoteViews for each train entry.

package com.MobilityHub.TransitTime_Seoul.widget;

import android.content.Context;
import android.widget.RemoteViews;
import android.widget.RemoteViewsService;
import com.MobilityHub.TransitTime_Seoul.R;
import com.MobilityHub.TransitTime_Seoul.utility.TrainLogoUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.List;
import android.util.Log;

public class ListRemoteViewsFactory implements RemoteViewsService.RemoteViewsFactory {
    private Context context;
    private static List<JSONObject> trainDataList = new ArrayList<>();

    public ListRemoteViewsFactory(Context context) {
        this.context = context;
    }

    @Override
    public void onCreate() {
        // Initialize your data list here
    }

    @Override
    public void onDataSetChanged() {
        Log.d("ListRemoteViewsFactory", "onDataSetChanged called");
        // Data is updated via the static method
    }

    @Override
    public void onDestroy() {
        trainDataList.clear();
    }

    @Override
    public int getCount() {
        return trainDataList.size();
    }

    @Override
    public RemoteViews getViewAt(int position) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_list_item);
        JSONObject trainData = trainDataList.get(position);
        String formattedMessage = "";
        String numberInBrackets = null; // To hold the number in brackets

        try {
            Log.d("ListRemoteViewsFactory", "Train Data: " + trainData.toString());
            views.setTextViewText(R.id.station_name, trainData.getString("stationName"));

            // Get arrival time and arvlMsg2
            String arrivalTime = trainData.getString("arrivalTime");
            String arvlMsg2 = trainData.getString("arvlMsg2");

            // Apply the logic based on arrivalTime and arvlMsg2
            if ("0".equals(arrivalTime)) {
                // Format message based on arvlMsg2 when arrivalTime is 0
                if (arvlMsg2.contains("전역 도착")) {
                    formattedMessage = "전역 도착";
                } else if (arvlMsg2.contains("전역 진입")) {
                    formattedMessage = "전역 진입";
                } else if (arvlMsg2.contains("전역 출발")) {
                    formattedMessage = "전역 출발";
                } else if (arvlMsg2.contains("도착") && arvlMsg2.replace("도착", "").trim().equals(trainData.getString("stationName"))) {
                    formattedMessage = "도착";
                } else if (arvlMsg2.contains("출발") && arvlMsg2.replace("출발", "").trim().equals(trainData.getString("stationName"))) {
                    formattedMessage = "출발";
                } else if (arvlMsg2.contains("진입") && arvlMsg2.replace("진입", "").trim().equals(trainData.getString("stationName"))) {
                    formattedMessage = "진입";
                }

                // Extract number from arvlMsg2 if it contains brackets
                if (arvlMsg2.contains("[")) {
                    int startIndex = arvlMsg2.indexOf("[") + 1;
                    int endIndex = arvlMsg2.indexOf("]");
                    if (endIndex > startIndex) {
                        numberInBrackets = arvlMsg2.substring(startIndex, endIndex);
                    }
                }
            } else if (Integer.parseInt(arrivalTime) < 1) {
                formattedMessage = "Arrival: <1 분"; // Display if arrival time is less than 1
            } else {
                formattedMessage = arrivalTime + "분"; // Display remaining time in minutes
            }

            // Set direction
            String direction = trainData.getString("direction");
            views.setTextViewText(R.id.train_direction, direction);

            // Set the formatted message in the time remaining view
            views.setTextViewText(R.id.time_remaining_for_train, formattedMessage);

            // Set the combined message in the time_remaining_for_train view
            if (numberInBrackets != null) {
                views.setTextViewText(R.id.time_remaining_for_train, numberInBrackets + "역" + "\n" + "남음"); // Combined number and suffix
            }

            // Set the train type below the direction
            String typeOfTrain = trainData.getString("typeOfTrain");
            if (direction.contains("(막차)")) {
                typeOfTrain += " (막차)"; // Append "막차" if applicable
            }
            views.setTextViewText(R.id.train_type, typeOfTrain); // Set the new TextView for train type

            views.setImageViewResource(R.id.line_name_icon, TrainLogoUtils.getLogoResourceId(trainData.getString("lineName")));
        } catch (Exception e) {
            e.printStackTrace();
        }

        return views;
    }

    public static void updateData(JSONArray newData) {
        trainDataList.clear();
        for (int i = 0; i < newData.length(); i++) {
            try {
                trainDataList.add(newData.getJSONObject(i));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public boolean hasStableIds() {
        return true; // or false, depending on your needs
    }

    @Override
    public long getItemId(int position) {
        return position; // or a unique ID for each item
    }

    @Override
    public int getViewTypeCount() {
        return 1; // Typically 1 unless you have multiple view types
    }

    @Override
    public RemoteViews getLoadingView() {
        return null; // Return null if you don't need a custom loading view
    }

    // Other required methods...
}
