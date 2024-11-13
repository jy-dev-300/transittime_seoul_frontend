package com.MobilityHub.TransitTime_Seoul;
import android.content.Context;
import android.content.SharedPreferences;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class SharedPreferencesModule extends ReactContextBaseJavaModule {

    private static final String PREFS_NAME = "widgetPrefs";

    public SharedPreferencesModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "SharedPreferencesModule";
    }

    @ReactMethod
    public void saveStation(String stationName, String lineName) {
        SharedPreferences prefs = getReactApplicationContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putString("stationName", stationName);
        editor.putString("lineName", lineName);
        editor.apply();
    }
}

