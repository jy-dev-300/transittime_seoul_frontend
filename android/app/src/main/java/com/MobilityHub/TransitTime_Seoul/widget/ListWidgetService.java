// frontend/android/app/src/main/java/com/MobilityHub/TransitTime_Seoul/widget/ListWidgetService.java
package com.MobilityHub.TransitTime_Seoul.widget;

import android.content.Intent;
import android.widget.RemoteViewsService;

public class ListWidgetService extends RemoteViewsService {
    @Override
    public RemoteViewsFactory onGetViewFactory(Intent intent) {
        return new ListRemoteViewsFactory(this.getApplicationContext());
    }
}

