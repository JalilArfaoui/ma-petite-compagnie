"use client";
import React, { useState, useEffect } from 'react';
import MonthlyTile from './tiles/monthly-tile';

export type Evenement = {
    id: number;
    nom: string;
    compagnieId: number;
    lieuId: number;
    categorieId: number;
    dateDebut: number;
    dateFin: number;
}

export type CalendarDay = {
    day: number;
    month: number;
    year: number;
    isCurrentMonth?: boolean | undefined;
    isCurrentWeek?: boolean | undefined;
    events: Evenement[];
}



interface EventCalendarProps {
    events: Evenement[];
    onEventClick?: (event: Evenement) => void;
}

const Calendar: React.FC<EventCalendarProps> = ({ events, onEventClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
    const [viewType, setViewType] = useState<'monthly' | 'weekly'>('monthly');

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // 1-12
    const daysInMonth = new Date(year, month, 0).getDate();

    const WEEKDAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi','Dimanche'];
    const MONTHS = [
        'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'
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


        if (viewType === 'weekly') {
            // Find the start of the week (Monday) for the current date
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - (currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1));
            
            for (let i = 0; i < 7; i++) {
                const day = new Date(startOfWeek);
                day.setDate(startOfWeek.getDate() + i);
                
                arr.push({
                    day: day.getDate(),
                    month: day.getMonth() + 1,
                    year: day.getFullYear(),
                    isCurrentWeek: true,
                    events: getEventsForDay(day.getDate(), day.getMonth() + 1, day.getFullYear())
                });
            }
            
            setCalendarDays(arr);
            return;
        }
        
        // Previous month days
        for (let i = firstDayOfMonth - 2; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            arr.push({
                day,
                month: prevMonth,
                year: prevYear,
                isCurrentMonth: false,
                isCurrentWeek: false,   
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
                isCurrentWeek: true,
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
                isCurrentWeek: false,
                events: getEventsForDay(i, nextMonth, nextYear)
            });
        }
        
        setCalendarDays(arr);
    }, [currentDate, events, month, year, daysInMonth, viewType]);

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
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/></svg>
                </button>
                
                <div className="header-center">
                    <h2 className="month-year">{MONTHS[month - 1]} {year}</h2>
                    <button onClick={goToToday} className="today-button">
                        Today
                    </button>
                </div>


                <button onClick={() => {
                    setViewType(viewType === 'monthly' ? 'weekly' : 'monthly');
                }}>
                    {viewType === 'monthly' ? 'Weekly View' : 'Monthly View'}
                </button>
                <button onClick={goToNextMonth} className="nav-button">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>
                </button>
            </div>

            <div className="calendar-content">
                {
                    viewType === 'weekly' && (
                        <div className="time-slots">
                            {Array.from({ length: 24 }, (_, i) => (
                                <div key={i} className="time-slot">
                                    {i}:00
                                </div>
                            ))}
                        </div>
                    )
                }
                <div className="calendar-grid">
                    <div className="weekdays-container">
                        {WEEKDAYS.map(day => (
                            <div key={day} className="weekday-header">
                                {day}
                            </div>
                        ))}
                    </div>

                        <div className='days'>
                            {calendarDays.map((calDay, index) => {
                        
                            return (
                                <MonthlyTile 
                                    key={index}
                                    calDay={calDay}
                                    index={index}
                                    onEventClick={onEventClick}
                                    isToday={isToday(calDay)}
                                    viewType={viewType}
                                />
                            )
                            })}
                        </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;