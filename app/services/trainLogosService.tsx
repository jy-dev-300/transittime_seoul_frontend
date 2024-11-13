export const getLogoResource = (lineNumber: string): React.FC => {
  switch (lineNumber) {
    case "1호선":
      return require('../../assets/logos/line_1_logo.svg').default;
    case "2호선":
      return require('../../assets/logos/line_2_logo.svg').default;
    case "3호선":
      return require('../../assets/logos/line_3_logo.svg').default;
    case "4호선":
      return require('../../assets/logos/line_4_logo.svg').default;
    case "5호선":
      return require('../../assets/logos/line_5_logo.svg').default;
    case "6호선":
      return require('../../assets/logos/line_6_logo.svg').default;
    case "7호선":
      return require('../../assets/logos/line_7_logo.svg').default;
    case "8호선":
      return require('../../assets/logos/line_8_logo.svg').default;
    case "9호선":
      return require('../../assets/logos/line_9_logo.svg').default;
    case "신림선":
      return require('../../assets/logos/line_sinlim_logo.svg').default;
    case "경부선":
      return require('../../assets/logos/line_1_logo.svg').default;
    case "공항철도":
      return require('../../assets/logos/line_airport_logo.svg').default;
    case "경의중앙선":
      return require('../../assets/logos/line_kyungee_logo.svg').default;
    case "김포골드라인":
      return require('../../assets/logos/line_gold_logo.svg').default;
    case "인천1호선":
      return require('../../assets/logos/line_incheon1_logo.svg').default;
    case "인천2호선":
      return require('../../assets/logos/line_incheon2_logo.svg').default;
    case "경춘선":
      return require('../../assets/logos/line_kyungchoon_logo.svg').default;
    case "경강선":
      return require('../../assets/logos/line_kyungkang_logo.svg').default;
    case "우이신설선":
      return require('../../assets/logos/line_oui_logo.svg').default;
    case "서해선":
      return require('../../assets/logos/line_seohae_logo.svg').default;
    case "신분당선":
      return require('../../assets/logos/line_shinbun_logo.svg').default;
    case "수인선":
      return require('../../assets/logos/line_sooin_logo.svg').default;
    case "수의분당선":
      return require('../../assets/logos/line_sooin_logo.svg').default;
    case "의정부선":
      return require('../../assets/logos/line_uijung_logo.svg').default;
    case "에버라인선":
      return require('../../assets/logos/line_yongin_logo.svg').default;
    default:
      return null; // Fallback for unknown line numbers
  }
};
