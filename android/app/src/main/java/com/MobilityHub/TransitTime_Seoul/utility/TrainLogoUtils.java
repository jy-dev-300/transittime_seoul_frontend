package com.MobilityHub.TransitTime_Seoul.utility;

import com.MobilityHub.TransitTime_Seoul.R;

public class TrainLogoUtils {
    public static int getLogoResourceId(String lineNumber) {
        int logoResId;
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
            case "신림선":
                logoResId = R.drawable.line_sinlim_logo;
                break;
            case "경부선":
                logoResId = R.drawable.line_1_logo;
                break;
            case "공항철도":
                logoResId = R.drawable.line_airport_logo;
                break;
            case "경의중앙선":
                logoResId = R.drawable.line_kyungee_logo;
                break;
            case "김포골드라인":
                logoResId = R.drawable.line_gold_logo;
                break;
            case "인천1호선":
                logoResId = R.drawable.line_incheon1_logo;
                break;
            case "인천2호선":
                logoResId = R.drawable.line_incheon2_logo;
                break;
            case "경춘선":
                logoResId = R.drawable.line_kyungchoon_logo;
                break;
            case "경강선":
                logoResId = R.drawable.line_kyungkang_logo;
                break;
            case "우이신설선":
                logoResId = R.drawable.line_oui_logo;
                break;
            case "서해선":
                logoResId = R.drawable.line_seohae_logo;
                break;
            case "신분당선":
                logoResId = R.drawable.line_shinbun_logo;
                break;
            case "수인선":
                logoResId = R.drawable.line_sooin_logo;
                break;
            case "수의분당선":
                logoResId = R.drawable.line_sooin_logo;
                break;
            case "의정부선":
                logoResId = R.drawable.line_uijung_logo;
                break;
            case "에버라인선":
                logoResId = R.drawable.line_yongin_logo;
                break;
            default:
                logoResId = -1;
                break;
        }
        return logoResId;
    }
}