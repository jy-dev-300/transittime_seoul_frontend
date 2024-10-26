
//Supplies data to each item in the ListView, creating RemoteViews for each train entry.

package com.MobilityHub.TransitTime_NYC.widget;

import android.content.Context;
import android.widget.RemoteViews;
import android.widget.RemoteViewsService;
import com.MobilityHub.TransitTime_NYC.R;
import com.MobilityHub.TransitTime_NYC.utility.TrainLogoUtils;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.List;

public class ListRemoteViewsFactory implements RemoteViewsService.RemoteViewsFactory {
    private Context context;
    private List<JSONObject> trainDataList;

    public ListRemoteViewsFactory(Context context) {
        this.context = context;
    }

    @Override
    public void onCreate() {
        trainDataList = new ArrayList<>();
    }

    @Override
    public void onDataSetChanged() {
        // Fetch and update your data list here
        // Example: trainDataList = fetchData();
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
        try {
            views.setTextViewText(R.id.station_name, trainData.getString("stationName"));
            views.setTextViewText(R.id.direction_type, trainData.getString("directionType"));
            views.setTextViewText(R.id.minutes_remaining, trainData.getString("minutesRemaining"));
            views.setImageViewResource(R.id.line_name_icon, TrainLogoUtils.getLogoResourceId(trainData.getString("lineName")));
        } catch (Exception e) {
            e.printStackTrace();
        }

        return views;
    }

    // Other required methods...
}

