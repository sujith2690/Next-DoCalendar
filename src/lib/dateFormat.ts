export const formatDateToGoogleCalendar = (input: string) => {
    const date = new Date(input);

    const offsetMinutes = -date.getTimezoneOffset(); // Flip sign because getTimezoneOffset returns negative for IST
    const offsetHours = Math.floor(offsetMinutes / 60);
    const offsetMins = offsetMinutes % 60;
    const offsetSign = offsetMinutes >= 0 ? "+" : "-";
    const offset = `${offsetSign}${String(Math.abs(offsetHours)).padStart(2, "0")}:${String(Math.abs(offsetMins)).padStart(2, "0")}`;

    const localDateTime = date.toISOString().slice(0, 19); // Remove 'Z' and milliseconds
    return `${localDateTime}${offset}`;
};