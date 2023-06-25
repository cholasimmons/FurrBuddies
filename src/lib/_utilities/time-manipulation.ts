export function getWorkingHours(time: Date): string {
    const serverTimeString = time;

    // Create a new Date object using the serverTimeString
    const serverTime = new Date(serverTimeString);

    // Extract hours and minutes from the serverTime
    const hours = serverTime.getUTCHours();
    const minutes = serverTime.getUTCMinutes().toString().padStart(2, '0');

    // Display the extracted time
    // console.log(`Hours: ${hours}`);
    // console.log(`Minutes: ${minutes}`);
    return (hours + ':' + minutes + ' hrs')
}

// Check if today is the same day as inputted day
export function isItToday(day: number): boolean {
    // 1 = Monday - 7 = Sunday
    const today = new Date().getDay();
    // console.log('Today: ',today);

    return day === today ? true : false;
}

// Check if today is the same day as inputted date
export function isItNow(timeFrom: Date, timeTo: Date): boolean {

    const currentTime = new Date(); // Current Time

    // Check if the current time is between the "from" and "to" times
    if (currentTime >= timeFrom && currentTime <= timeTo) {
        return true;
    } else {
        return false;
    }
}