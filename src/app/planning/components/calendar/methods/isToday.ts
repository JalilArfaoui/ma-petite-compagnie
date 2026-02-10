import { CalendarDay } from "../calendar";

const isToday = (day: CalendarDay): boolean => {
    const today = new Date();
    return day.day === today.getDate() &&
            day.month === today.getMonth() + 1 &&
            day.year === today.getFullYear();
};

export default isToday;