package com.MobilityHub.TransitTime_NYC;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.MobilityHub.TransitTime_NYC.widget.List; // Import your widget provider class

public class WidgetUpdaterModule extends ReactContextBaseJavaModule {

    public WidgetUpdaterModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "WidgetUpdater";
    }

    @ReactMethod
    public void updateWidget() {
        Context context = getReactApplicationContext();
        Intent intent = new Intent(context, List.class); // Ensure this is your actual widget provider class
        intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
        int[] ids = AppWidgetManager.getInstance(context).getAppWidgetIds(new ComponentName(context, List.class));
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids);
        context.sendBroadcast(intent);
    }
}
