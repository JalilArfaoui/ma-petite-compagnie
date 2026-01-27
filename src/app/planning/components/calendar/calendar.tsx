"use client";
import React, { useState, useEffect } from 'react';

export type Evenement = {
    id: number;
    nom: string;
    compagnieId: number;
    lieuId: number;
    categorieId: number;
    dateDebut: number;
    dateFin: number;
}

type CalendarDay = {
    day: number;
    month: number;
    year: number;
    isCurrentMonth: boolean;
    events: Evenement[];
}

interface EventCalendarProps {
    events: Evenement[];
    onEventClick?: (event: Evenement) => void;
}

const Calendar: React.FC<EventCalendarProps> = ({ events, onEventClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // 1-12
    const daysInMonth = new Date(year, month, 0).getDate();

    const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const MONTHS = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Check if an event occurs on a specific day
    const isEventOnDay = (event: Evenement, dayTimestamp: number): boolean => {
        const dayStart = new Date(dayTimestamp).setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayTimestamp).setHours(23, 59, 59, 999);
        
        return (event.dateDebut <= dayEnd && event.dateFin >= dayStart);
    };

    // Get events for a specific day
    const getEventsForDay = (day: number, month: number, year: number): Evenement[] => {
        const dayTimestamp = new Date(year, month - 1, day).getTime();
        return events.filter(event => isEventOnDay(event, dayTimestamp));
    };

    useEffect(() => {
        const arr: CalendarDay[] = [];
        
        const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
        
        // Get days in previous month
        const daysInPrevMonth = new Date(year, month - 1, 0).getDate();
        const prevMonth = month === 1 ? 12 : month - 1;
        const prevYear = month === 1 ? year - 1 : year;
        
        // Previous month days
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            arr.push({
                day,
                month: prevMonth,
                year: prevYear,
                isCurrentMonth: false,
                events: getEventsForDay(day, prevMonth, prevYear)
            });
        }
        
        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            arr.push({
                day: i,
                month: month,
                year: year,
                isCurrentMonth: true,
                events: getEventsForDay(i, month, year)
            });
        }
        
        // Next month days
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;
        const remainingDays = 42 - arr.length;
        
        for (let i = 1; i <= remainingDays; i++) {
            arr.push({
                day: i,
                month: nextMonth,
                year: nextYear,
                isCurrentMonth: false,
                events: getEventsForDay(i, nextMonth, nextYear)
            });
        }
        
        setCalendarDays(arr);
    }, [currentDate, events, month, year, daysInMonth]);

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(year, month - 2, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(year, month, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const isToday = (day: CalendarDay): boolean => {
        const today = new Date();
        return day.day === today.getDate() &&
               day.month === today.getMonth() + 1 &&
               day.year === today.getFullYear();
    };

    return (
        <div className="event-calendar">
            <div className="calendar-header">
                <button onClick={goToPreviousMonth} className="nav-button">
                    <span>‹</span>
                </button>
                
                <div className="header-center">
                    <h2 className="month-year">{MONTHS[month - 1]} {year}</h2>
                    <button onClick={goToToday} className="today-button">
                        Today
                    </button>
                </div>
                
                <button onClick={goToNextMonth} className="nav-button">
                    <span>›</span>
                </button>
            </div>

            <div className="calendar-grid">
                {WEEKDAYS.map(day => (
                    <div key={day} className="weekday-header">
                        {day}
                    </div>
                ))}

                {calendarDays.map((calDay, index) => (
                    <div
                        key={index}
                        className={`calendar-day ${!calDay.isCurrentMonth ? 'other-month' : ''} ${isToday(calDay) ? 'today' : ''}`}
                    >
                        <div className="day-number">{calDay.day}</div>
                        
                        <div className="events-container">
                            {calDay.events.slice(0, 3).map(event => (
                                <div
                                    key={event.id}
                                    className="event-tile"
                                    onClick={() => onEventClick?.(event)}
                                    title={event.nom}
                                >
                                    <span className="event-name">{event.nom}</span>
                                </div>
                            ))}
                            {calDay.events.length > 3 && (
                                <div className="more-events">
                                    +{calDay.events.length - 3} more
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;