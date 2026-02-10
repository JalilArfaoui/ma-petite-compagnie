"use client";
import React, { useState, useEffect } from 'react';
import MonthlyTile from './tiles/monthly-tile';
import CreateEventAction from '../actions/create-event';
import { months, weekdays } from './utils/constant';
import useHandleResize from './methods/useHandleResize';
import isToday from './methods/isToday';
import isEventOnDay from './methods/isEventOnDay';
import { moveView } from './methods/moveView';
import ChangeCalendarView from './change-view';
import { TimeSlotsOverlay, WeeklyTimeSlots } from './time-slots';
import { Evenement } from '@prisma/client';


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


    const goToToday = () => {
        setCurrentDate(new Date());
    };


    const ref = React.useRef<HTMLDivElement>(null);
    const [globalSlotsHeight, setGlobalSlotsHeight] = useState(0);

    useEffect(() => {
        if (ref.current) {
            // On divise la hauteur totale par 24 pour obtenir la hauteur d'une slot horaire et on prend en compte le fait qu'il y ai une 
            // bordure de 1px entre chaque slot horaire
            setGlobalSlotsHeight(
                (ref.current.clientHeight) / 24 
            );
        }
    }, [viewType]);

    useHandleResize({ ref, setGlobalSlotsHeight });


    return (
            <div className="event-calendar">
                <div className="calendar-header">
                    <button onClick={() => moveView.goToPreviousMonth({ currentDate, setCurrentDate, viewType, year, month })} className="nav-button">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/></svg>
                    </button>
                    
                    <div className="header-center">
                        <h2 className="month-year">{months[month - 1]} {year}</h2>
                        <button onClick={goToToday} className="today-button">
                            Today
                        </button>
                    </div>

                        
                    <div className="buttons-container">
                        <ChangeCalendarView viewType={viewType} setViewType={setViewType} />
                        <button onClick={() => moveView.goToNextMonth({ currentDate, setCurrentDate, viewType, year, month })} className="nav-button">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>
                        </button>
                    </div>
                </div>
                

                <div className="calendar">
                    <CreateEventAction />
                    <div className="calendar-content">
                        <WeeklyTimeSlots viewType ={viewType} />
                        <div className="calendar-grid">
                            <div className="weekdays-container">
                                {weekdays.map(day => (
                                    <div key={day} className="weekday-header">
                                        {day}
                                    </div>
                                ))}
                            </div>

                                <div className='days'>
                                    <TimeSlotsOverlay viewType={viewType} globalSlotsHeight={globalSlotsHeight} />


                                    {calendarDays.map((calDay, index) => {
                                        return (
                                            <MonthlyTile 
                                                key={index}
                                                calDay={calDay}
                                                index={index}
                                                onEventClick={onEventClick}
                                                viewType={viewType}
                                                slotHeight={globalSlotsHeight}
                                            />
                                        )
                                    })}
                                </div>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default Calendar;