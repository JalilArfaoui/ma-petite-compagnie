"use client";
import React, { useState, useEffect } from "react";
import CalendarTile from "./tiles/calendar-tiles";
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
import { MINI_WEEKDAYS, MONTHS, WEEKDAYS } from "./utils/constant";

export type EvenementBuiltInt = {
  id: number;
  nom: string;
  compagnieId: number;
  lieuId: number;
  categorieId: number;
  dateDebut: number;
  dateFin: number;
  startMinutes?: number;
  endMinutes?: number;
  column?: number;
  columnsCount?: number;
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



const Calendar: React.FC<EventCalendarProps> = ({ events, onEventClick }: EventCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [viewType, setViewType] = useState<"monthly" | "weekly">("monthly");
  const [isQuickCalendarOpen, setIsQuickCalendarOpen] = useState(false);
  const [quickDate, setQuickDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 1-12
  const daysInMonth = new Date(year, month, 0).getDate();

  const isEventOnDay = (event: EvenementBuiltInt, dayTimestamp: number): boolean => {
    const dayStart = new Date(dayTimestamp).setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayTimestamp).setHours(23, 59, 59, 999);
    return event.dateDebut <= dayEnd && event.dateFin > dayStart;
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

  const getStartOfWeek = (date: Date): Date => {
    const monday = new Date(date);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(date.getDate() - (date.getDay() === 0 ? 6 : date.getDay() - 1));
    return monday;
  };

  const isSameWeekDate = (left: Date, right: Date): boolean => {
    const leftWeek = getStartOfWeek(left);
    const rightWeek = getStartOfWeek(right);
    return (
      leftWeek.getDate() === rightWeek.getDate() &&
      leftWeek.getMonth() === rightWeek.getMonth() &&
      leftWeek.getFullYear() === rightWeek.getFullYear()
    );
  };

  const changeQuickMonth = (delta: number) => {
    setQuickDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const updateQuickYear = (value: string) => {
    const parsedYear = Number(value);
    if (Number.isNaN(parsedYear)) return;
    const boundedYear = Math.min(2100, Math.max(1900, parsedYear));
    setQuickDate((prev) => new Date(boundedYear, prev.getMonth(), 1));
  };

  const quickYear = quickDate.getFullYear();
  const quickMonth = quickDate.getMonth();
  const quickFirstDayOffset = (new Date(quickYear, quickMonth, 1).getDay() + 6) % 7;
  const quickDaysInCurrentMonth = new Date(quickYear, quickMonth + 1, 0).getDate();
  const quickDaysInPrevMonth = new Date(quickYear, quickMonth, 0).getDate();

  const quickCalendarDays: Date[] = [];
  for (let i = quickFirstDayOffset; i > 0; i--) {
    quickCalendarDays.push(new Date(quickYear, quickMonth - 1, quickDaysInPrevMonth - i + 1));
  }
  for (let i = 1; i <= quickDaysInCurrentMonth; i++) {
    quickCalendarDays.push(new Date(quickYear, quickMonth, i));
  }
  const remainingQuickDays = 42 - quickCalendarDays.length;
  for (let i = 1; i <= remainingQuickDays; i++) {
    quickCalendarDays.push(new Date(quickYear, quickMonth + 1, i));
  }

  const selectQuickDate = (selectedDate: Date) => {
    setCurrentDate(getStartOfWeek(selectedDate));
    setViewType("weekly");
    setIsQuickCalendarOpen(false);
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

  const measureSlotHeight = () => {
    if (!ref.current) return;
    const firstSlot = ref.current.querySelector<HTMLElement>(".time-slot");
    if (firstSlot) {
      setGlobalSlotsHeight(firstSlot.getBoundingClientRect().height);
      return;
    }
    setGlobalSlotsHeight(ref.current.clientHeight / 24);
  };

  useEffect(() => {
    measureSlotHeight();
  }, [viewType]);

  useEffect(() => {
    const handleResize = () => {
      measureSlotHeight();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isQuickCalendarOpen) return;
      if (!(event.target instanceof Node)) return;
      const target = event.target as HTMLElement;
      if (!target.closest(".quick-calendar-wrapper")) {
        setIsQuickCalendarOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isQuickCalendarOpen]);

  return (
    <div className="event-calendar">
      <div className="calendar-header">
        <div className="header-center">
          <Heading as="h1" className="month-year">
            {MONTHS[month - 1]} {year}
          </Heading>
        </div>

        <div className="buttons-container">
          <Button variant="solid" onClick={goToPreviousMonth} aria-label="Periode precedente">
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

          <div className="quick-calendar-wrapper">
            <Button
              variant="outline"
              aria-label="Ouvrir le mini calendrier"
              onClick={() => {
                setQuickDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
                setIsQuickCalendarOpen((prev) => !prev);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="currentColor"
              >
                <path d="M200-80q-33 0-56.5-23.5T120-160v-600q0-33 23.5-56.5T200-840h80v-80h80v80h240v-80h80v80h80q33 0 56.5 23.5T840-760v600q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-120H200v120Zm0 0v-120 120Z" />
              </svg>
            </Button>
            {isQuickCalendarOpen && (
              <div className="quick-calendar-panel">
                <div className="quick-calendar-top">
                  <div className="quick-year-control">
                    <input
                      type="number"
                      min={1900}
                      max={2100}
                      value={quickYear}
                      onChange={(event) => updateQuickYear(event.target.value)}
                    />
                  </div>
                </div>

                <div className="quick-calendar-month-nav">
                  <button
                    type="button"
                    onClick={() => changeQuickMonth(-1)}
                    aria-label="Mois precedent"
                  >
                    ‹
                  </button>
                  <span>
                    {MONTHS[quickMonth]} {quickYear}
                  </span>
                  <button
                    type="button"
                    onClick={() => changeQuickMonth(1)}
                    aria-label="Mois suivant"
                  >
                    ›
                  </button>
                </div>

                <div className="quick-calendar-weekdays">
                  {MINI_WEEKDAYS.map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>

                <div className="quick-calendar-days">
                  {quickCalendarDays.map((dayDate) => {
                    const isOutMonth = dayDate.getMonth() !== quickMonth;
                    const isSelectedWeek = isSameWeekDate(dayDate, currentDate);

                    return (
                      <button
                        key={dayDate.toISOString()}
                        type="button"
                        className={`quick-day ${isOutMonth ? "out-month" : ""} ${isSelectedWeek ? "selected-week" : ""}`}
                        onClick={() => selectQuickDate(dayDate)}
                      >
                        {dayDate.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            className="view-toggle-button"
            onClick={() => setViewType(viewType === "monthly" ? "weekly" : "monthly")}
          >
            {viewType === "monthly" ? "Semaine" : "Mois"}
          </Button>

          <Button variant="outline" onClick={goToToday}>
            Aujourd&apos;hui
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
                <div key={day.full} className="weekday-header">
                  <span className="weekday-full">{day.full}</span>
                  <span className="weekday-short">{day.short}</span>
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
                <CalendarTile
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
