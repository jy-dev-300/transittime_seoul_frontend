package com.MobilityHub.TransitTime_NYC.utility;

import com.MobilityHub.TransitTime_NYC.R;

public class LineLogoUtils {

    public static int getLogoResourceId(String lineNumber) {
        switch (lineNumber) {
                            case "1호선":
                                logoResId = R.drawable.line_1_logo;
                                break;
                            case "2호선":
                                logoResId = R.drawable.line_2_logo;
                                break;
                            case "3호선":
                                logoResId = R.drawable.line_3_logo;
                                break;
                            case "4호선":
                                logoResId = R.drawable.line_4_logo;
                                break;
                            case "5호선":
                                logoResId = R.drawable.line_5_logo;
                                break;
                            case "6호선":
                                logoResId = R.drawable.line_6_logo;
                                break;
                            case "7호선":
                                logoResId = R.drawable.line_7_logo;
                                break;
                            case "8호선":
                                logoResId = R.drawable.line_8_logo;
                                break;
                            case "9호선":
                                logoResId = R.drawable.line_9_logo;
                                break;
                            default:
                                logoResId = lineNumber;
                                break;
                        }
                        
                    }
}