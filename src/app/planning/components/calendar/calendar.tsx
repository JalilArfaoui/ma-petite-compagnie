"use client";
import React, { useState, useEffect } from 'react';
import MonthlyTile from './tiles/monthly-tile';
// import CreateEventAction from '../actions/create-event';

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
        if (viewType === 'weekly') {
            const prevWeekDate = new Date(currentDate);
            prevWeekDate.setDate(currentDate.getDate() - 7);
            setCurrentDate(prevWeekDate);
            return;
        }
        setCurrentDate(new Date(year, month - 2, 1));
    };

    const goToNextMonth = () => {
        if (viewType === 'weekly') {
            const nextWeekDate = new Date(currentDate);
            nextWeekDate.setDate(currentDate.getDate() + 7);
            setCurrentDate(nextWeekDate);
            return;
        }
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

    // Si on ajuste la taille de la fenêtre, on recalcule la hauteur des slots horaires
    useEffect(() => {
        const handleResize = () => {
            if (ref.current) {
                setGlobalSlotsHeight(
                    (ref.current.clientHeight) / 24 
                );
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);



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
                    <div>
                        <button onClick={() => {
                            setViewType(viewType === 'monthly' ? 'weekly' : 'monthly');
                        }} className="nav-button"
                        >
                            {viewType === 'monthly' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M120-540v-180q0-17 11.5-28.5T160-760h133q17 0 28.5 11.5T333-720v180q0 17-11.5 28.5T293-500H160q-17 0-28.5-11.5T120-540Zm293 40q-17 0-28.5-11.5T373-540v-180q0-17 11.5-28.5T413-760h134q17 0 28.5 11.5T587-720v180q0 17-11.5 28.5T547-500H413Zm254 0q-17 0-28.5-11.5T627-540v-180q0-17 11.5-28.5T667-760h133q17 0 28.5 11.5T840-720v180q0 17-11.5 28.5T800-500H667ZM293-200H160q-17 0-28.5-11.5T120-240v-180q0-17 11.5-28.5T160-460h133q17 0 28.5 11.5T333-420v180q0 17-11.5 28.5T293-200Zm120 0q-17 0-28.5-11.5T373-240v-180q0-17 11.5-28.5T413-460h134q17 0 28.5 11.5T587-420v180q0 17-11.5 28.5T547-200H413Zm254 0q-17 0-28.5-11.5T627-240v-180q0-17 11.5-28.5T667-460h133q17 0 28.5 11.5T840-420v180q0 17-11.5 28.5T800-200H667Z"/></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M550-200q-17 0-28.5-11.5T510-240v-480q0-17 11.5-28.5T550-760h55q17 0 28.5 11.5T645-720v480q0 17-11.5 28.5T605-200h-55Zm-195 0q-17 0-28.5-11.5T315-240v-480q0-17 11.5-28.5T355-760h55q17 0 28.5 11.5T450-720v480q0 17-11.5 28.5T410-200h-55Zm-195 0q-17 0-28.5-11.5T120-240v-480q0-17 11.5-28.5T160-760h55q17 0 28.5 11.5T255-720v480q0 17-11.5 28.5T215-200h-55Zm585 0q-17 0-28.5-11.5T705-240v-480q0-17 11.5-28.5T745-760h55q17 0 28.5 11.5T840-720v480q0 17-11.5 28.5T800-200h-55Z"/></svg>
                            )}
                        </button>
                    </div>

                    <button onClick={goToNextMonth} className="nav-button">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>
                    </button>
                </div>
                

                <div className="calendar">
                    <div className="calendar-content">
                        {
                            viewType === 'weekly' && (
                                <div className="time-slots" ref={ref}>
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
                                    {
                                        viewType === 'weekly' && 
                                                Array.from({ length: 24 }, (_, i) => (
                                                    <div key={i} className="time-slot-overlay" style={{
                                                        top: `calc(50px + ${i*globalSlotsHeight}px)`,
                                                    }}>
                                                    </div>
                                                ))
                                        
                                    }


                                    {calendarDays.map((calDay, index) => {
                                
                                    return (
                                        <MonthlyTile 
                                            key={index}
                                            calDay={calDay}
                                            index={index}
                                            onEventClick={onEventClick}
                                            isToday={isToday(calDay)}
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