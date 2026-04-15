"use client";
import React, { useState, useEffect } from "react";
import MonthlyTile from "./tiles/monthly-tile";
import CreateEventAction from "../actions/create-event";
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Input,
  Link,
  List,
  Radio,
  RadioGroup,
  Switch,
  Table,
  Textarea,
  Heading,
  Box,
  Container,
  Stack,
  Text,
  Icon,
  SearchBar,
} from "@/components/ui";

export type EvenementBuiltInt = {
  id: number;
  nom: string;
  compagnieId: number;
  lieuId: number;
  categorieId: number;
  dateDebut: number;
  dateFin: number;
};

export type CalendarDay = {
  day: number;
  month: number;
  year: number;
  isCurrentMonth?: boolean | undefined;
  isCurrentWeek?: boolean | undefined;
  events: EvenementBuiltInt[];
};

interface EventCalendarProps {
  events: EvenementBuiltInt[];
  onEventClick?: (event: EvenementBuiltInt) => void;
}

const WEEKDAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const MONTHS = [
  "Janvier",
  "Fevrier",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Aout",
  "Septembre",
  "Octobre",
  "Novembre",
  "Decembre",
];

const Calendar: React.FC<EventCalendarProps> = ({ events, onEventClick }: EventCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [viewType, setViewType] = useState<"monthly" | "weekly">("monthly");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 1-12
  const daysInMonth = new Date(year, month, 0).getDate();

  const isEventOnDay = (event: EvenementBuiltInt, dayTimestamp: number): boolean => {
    const dayStart = new Date(dayTimestamp).setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayTimestamp).setHours(23, 59, 59, 999);
    return event.dateDebut <= dayEnd && event.dateFin >= dayStart;
  };

  const getEventsForDay = (day: number, month: number, year: number): EvenementBuiltInt[] => {
    const dayTimestamp = new Date(year, month - 1, day).getTime();
    return events.filter((event) => isEventOnDay(event, dayTimestamp));
  };

  useEffect(() => {
    const arr: CalendarDay[] = [];

    // JS Date#getDay => 0=Sunday ... 6=Saturday; we convert to Monday-first index (0=Monday).
    const firstDayOfMonth = (new Date(year, month - 1, 1).getDay() + 6) % 7;
    const daysInPrevMonth = new Date(year, month - 1, 0).getDate();
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;

    if (viewType === "weekly") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(
        currentDate.getDate() - (currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1)
      );

      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);

        arr.push({
          day: day.getDate(),
          month: day.getMonth() + 1,
          year: day.getFullYear(),
          isCurrentWeek: true,
          events: getEventsForDay(day.getDate(), day.getMonth() + 1, day.getFullYear()),
        });
      }

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCalendarDays(arr);
      return;
    }

    // Previous month days
    for (let i = firstDayOfMonth; i > 0; i--) {
      const day = daysInPrevMonth - i + 1;
      arr.push({
        day,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false,
        isCurrentWeek: false,
        events: getEventsForDay(day, prevMonth, prevYear),
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
        events: getEventsForDay(i, month, year),
      });
    }

    // Next month days: only fill the last visible week (do not force a 6th row).
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const remainingDays = (7 - (arr.length % 7)) % 7;

    for (let i = 1; i <= remainingDays; i++) {
      arr.push({
        day: i,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
        isCurrentWeek: false,
        events: getEventsForDay(i, nextMonth, nextYear),
      });
    }

    setCalendarDays(arr);
  }, [currentDate, events, month, year, daysInMonth, viewType]);

  const goToPreviousMonth = () => {
    if (viewType === "weekly") {
      const prevWeekDate = new Date(currentDate);
      prevWeekDate.setDate(currentDate.getDate() - 7);
      setCurrentDate(prevWeekDate);
      return;
    }
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const goToNextMonth = () => {
    if (viewType === "weekly") {
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
    return (
      day.day === today.getDate() &&
      day.month === today.getMonth() + 1 &&
      day.year === today.getFullYear()
    );
  };

  const ref = React.useRef<HTMLDivElement>(null);
  const [globalSlotsHeight, setGlobalSlotsHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setGlobalSlotsHeight(ref.current.clientHeight / 24);
    }
  }, [viewType]);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setGlobalSlotsHeight(ref.current.clientHeight / 24);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="event-calendar">
      <div className="calendar-header">
        <Button variant="solid" onClick={goToPreviousMonth} className="btn-test">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e3e3e3"
          >
            <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
          </svg>
        </Button>

        <div className="header-center">
          <Heading as="h1" className="month-year">
            {MONTHS[month - 1]} {year}
          </Heading>
          {/* <Button variant="outline" onClick={goToToday}>
            <Heading as="h5"> Aujourd'hui</Heading>
          </Button> */}
        </div>

        <div className="buttons-container">
          <Button
            variant="outline"
            onClick={() => setViewType(viewType === "monthly" ? "weekly" : "monthly")}
          >
            {viewType === "monthly" ? "Semaine" : "Mois"}
          </Button>
          <Button variant="outline" onClick={goToToday}>
            Aujourd'hui
          </Button>
          <Button variant="solid" onClick={goToNextMonth}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e3e3e3"
            >
              <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
            </svg>
          </Button>
        </div>
      </div>

      <div className="calendar">
        <CreateEventAction />
        <div className="calendar-content">
          {viewType === "weekly" && (
            <div className="time-slots" ref={ref}>
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="time-slot">
                  {i}:00
                </div>
              ))}
            </div>
          )}

          <div className="calendar-grid">
            <div className="weekdays-container">
              {WEEKDAYS.map((day) => (
                <div key={day} className="weekday-header">
                  {day}
                </div>
              ))}
            </div>

            <div className={`days ${viewType}`}>
              {viewType === "weekly" &&
                Array.from({ length: 24 }, (_, i) => (
                  <div
                    key={i}
                    className="time-slot-overlay"
                    style={{
                      top: `calc(50px + ${i * globalSlotsHeight}px)`,
                    }}
                  />
                ))}

              {calendarDays.map((calDay, index) => (
                <MonthlyTile
                  key={index}
                  calDay={calDay}
                  index={index}
                  onEventClick={onEventClick}
                  viewType={viewType}
                  slotHeight={globalSlotsHeight}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
