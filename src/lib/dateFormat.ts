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
export const parseGoogleCalendarDate = (input: string): string => {
    const date = new Date(input);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};
export const localDateTime = (input: string): string => {
    const date = new Date(input);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours; // handle midnight as 12

    const formattedHours = String(hours).padStart(2, '0');

    return `${day}-${month}-${year} Time ${formattedHours}:${minutes} ${amOrPm}`;
};
