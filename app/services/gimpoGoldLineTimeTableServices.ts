interface StationTimeTable {
    stationNm: string,  // changed to stationNm to match the original name
    wkday: number[],
    wkndHoliday: number[]
}

export const findSoonestArrivalTimeGimpoGoldLine = async (
    stationName: string,  // stationName passed as an argument]
    userDay: string,
    userTime: number,
    stationTimeTables: StationTimeTable[]
): Promise<{ stationName: string; arrivalTimeLeft: number }[]> => {

    const arrivalTimes: { stationName: string; arrivalTimeLeft: number }[] = [];

    // Check if there are no timetables provided
    if (stationTimeTables.length === 0) {
        return []; // Return an empty array if no timetables are available
    }

    // Find the specific station timetable based on stationName
    const station = stationTimeTables.find(station => station.stationNm === stationName);

    if (!station) {
        return []; // Return an empty array if the station is not found
    }

    // Combine both wkday and wkndHoliday times if needed (or use just one)
    //if (userDay is in list named weekdays with mon tues wed etc)
    const times = station.wkday;
    //else
    //const times = station.wkndHoliday;

    // Find the soonest time that's greater than or equal to the user's time
    const soonestTime = times.find(time => time >= userTime);

    // If a valid time is found, calculate the time left until arrival
    if (soonestTime) {
        const arrivalTimeLeft = soonestTime - userTime;
        arrivalTimes.push({ stationName, arrivalTimeLeft });
    }

    return arrivalTimes;
};
