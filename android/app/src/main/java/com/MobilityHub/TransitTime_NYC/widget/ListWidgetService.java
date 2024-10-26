// frontend/android/app/src/main/java/com/MobilityHub/TransitTime_NYC/widget/ListWidgetService.java
package com.MobilityHub.TransitTime_NYC.widget;

import android.content.Intent;
import android.widget.RemoteViewsService;

public class ListWidgetService extends RemoteViewsService {
    @Override
    public RemoteViewsFactory onGetViewFactory(Intent intent) {
        return new ListRemoteViewsFactory(this.getApplicationContext());
    }
}

