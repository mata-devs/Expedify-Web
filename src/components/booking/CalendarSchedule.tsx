import React, { useMemo, useState } from "react";
import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    isSameMonth,
    format,
    isSameDay,
} from "date-fns";
import type { Booking } from "../../utils/type";

interface Props {
    bookings: Booking[];
    selectedBooking: Booking | null;
    selectedDate: Date | null;
    onSelectBooking: (b: Booking) => void;
    setSelectedDate: (date: Date) => void;
    setSelectedBooking: React.Dispatch<React.SetStateAction<Booking | null>>;
    weekStartsOn?: 0 | 1; // 0=Sun, 1=Mon (optional)

}

const CalendarSchedule: React.FC<Props> = ({
    bookings,
    selectedBooking,
    selectedDate,
    onSelectBooking,
    setSelectedDate,
    setSelectedBooking,
    weekStartsOn = 0, // Sunday start by default
}) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Build the full calendar grid (includes prev/next month spillover days)
    const days = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        const gridStart = startOfWeek(monthStart, { weekStartsOn });
        const gridEnd = endOfWeek(monthEnd, { weekStartsOn });

        const arr: Date[] = [];
        let d = gridStart;
        while (d <= gridEnd) {
            arr.push(d);
            d = addDays(d, 1);
        }
        return arr; // always multiples of 7
    }, [currentMonth, weekStartsOn]);

    // Group bookings by yyyy-MM-dd
    const bookingsByDate = useMemo(() => {
        const map: Record<string, Booking[]> = {};
        bookings.forEach((b) => {
            if (!b?.dateSchedule) return;
            const date = b.dateSchedule.toDate ? b.dateSchedule.toDate() : new Date(b.dateSchedule);
            const key = format(date, "yyyy-MM-dd");
            (map[key] ||= []).push(b);
        });
        return map;
    }, [bookings]);

    const goPrev = () =>
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    const goNext = () =>
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

    const weekdayLabels = weekStartsOn === 1
        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="w-full  p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 ">
                <button onClick={goPrev} className="px-3 py-1 text-gray-600 hover:text-yellow-600">← Prev</button>
                <h2 className="text-lg font-semibold text-gray-800">{format(currentMonth, "MMMM yyyy")}</h2>
                <button onClick={goNext} className="px-3 py-1 text-gray-600 hover:text-yellow-600">Next →</button>
            </div>

            {/* Weekday row */}
            <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-600 mb-2">
                {weekdayLabels.map((d) => <div key={d}>{d}</div>)}
            </div>

            {/* Calendar grid (6 rows × 7 cols typically) */}
            <div className="grid grid-cols-7 gap-2">
                {days.map((day) => {
                    const key = format(day, "yyyy-MM-dd");
                    const dayBookings = bookingsByDate[key] || [];
                    const inMonth = isSameMonth(day, currentMonth);

                    return (
                        <div
                            key={key}
                            onClick={() => { setSelectedDate(day); setSelectedBooking(null); }}
                            className={`border rounded-lg p-2 min-h-[56px] flex flex-col gap-1 transition
                                ${selectedDate == day ? "bg-yellow-100" : ""}
                ${inMonth ? "border-gray-200 hover:bg-yellow-50" : "border-gray-100 bg-gray-50 opacity-70"}`}
                        >
                            <p className={`text-xs font-semibold ${inMonth ? "text-gray-700" : "text-gray-400"}`}>
                                {format(day, "d")}
                            </p>
                            <p className="text-sm truncate">
                                {dayBookings.length != 0 && dayBookings.length + " Clients"} </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarSchedule;
