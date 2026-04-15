import isToday from "../methods/isToday";
import { CalendarDay, EvenementBuiltInt } from "../calendar";

type PositionedEvent = {
  event: EvenementBuiltInt;
  startMinutes: number;
  endMinutes: number;
  column: number;
  columnsCount: number;
};

export default function MonthlyTile({
  calDay,
  index,
  viewType,
  onEventClick,
  slotHeight,
}: {
  calDay: CalendarDay;
  index: number;
  onEventClick?: (event: EvenementBuiltInt) => void;
  viewType: "monthly" | "weekly";
  slotHeight?: number;
}) {
  const formatEventRange = (event: EvenementBuiltInt) => {
    const start = new Date(event.dateDebut);
    const end = new Date(event.dateFin);
    const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
    const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
    const dayDiff = Math.max(Math.round((endDay - startDay) / (24 * 60 * 60 * 1000)), 0);

    const hourLabel = (date: Date) => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      if (minutes === 0) return `${hours}h`;
      return `${hours}h${String(minutes).padStart(2, "0")}`;
    };

    const overlapSuffix = viewType === "weekly" && dayDiff > 0 ? ` +${dayDiff}` : "";
    return `${hourLabel(start)} - ${hourLabel(end)}${overlapSuffix}`;
  };

  const weeklyEvents: PositionedEvent[] =
    viewType === "weekly"
      ? (() => {
          const dayStart = new Date(calDay.year, calDay.month - 1, calDay.day).getTime();
          const dayEnd = dayStart + 24 * 60 * 60 * 1000;

          const baseEvents = calDay.events
            .map((event) => {
              const visibleStartTs = Math.max(event.dateDebut, dayStart);
              const visibleEndTs = Math.min(event.dateFin, dayEnd);
              const start = Math.floor((visibleStartTs - dayStart) / (60 * 1000));
              const end = Math.ceil((visibleEndTs - dayStart) / (60 * 1000));
              return {
                event,
                startMinutes: start,
                endMinutes: end,
              };
            })
            .filter((item) => item.endMinutes > item.startMinutes)
            .sort((a, b) => a.startMinutes - b.startMinutes || a.endMinutes - b.endMinutes);

          const positioned: PositionedEvent[] = [];
          let groupStart = 0;

          while (groupStart < baseEvents.length) {
            let groupEnd = groupStart + 1;
            let maxEndInGroup = baseEvents[groupStart].endMinutes;

            while (groupEnd < baseEvents.length && baseEvents[groupEnd].startMinutes < maxEndInGroup) {
              maxEndInGroup = Math.max(maxEndInGroup, baseEvents[groupEnd].endMinutes);
              groupEnd++;
            }

            const group = baseEvents.slice(groupStart, groupEnd);
            const activeColumns: { endMinutes: number; column: number }[] = [];
            let maxColumns = 0;

            const withColumns = group.map((item) => {
              for (let i = activeColumns.length - 1; i >= 0; i--) {
                if (activeColumns[i].endMinutes <= item.startMinutes) {
                  activeColumns.splice(i, 1);
                }
              }

              let column = 0;
              while (activeColumns.some((active) => active.column === column)) {
                column++;
              }

              activeColumns.push({ endMinutes: item.endMinutes, column });
              maxColumns = Math.max(maxColumns, activeColumns.length);
              return { ...item, column };
            });

            positioned.push(
              ...withColumns.map((item) => ({
                ...item,
                columnsCount: maxColumns,
              }))
            );
            groupStart = groupEnd;
          }

          return positioned;
        })()
      : [];

  return (
    <div
      key={index}
      className={`calendar-day ${!calDay.isCurrentMonth ? `other-${viewType}` : ""} ${isToday(calDay) ? "today" : ""}`}
      style={{
        borderRight: (index + 1) % 7 === 0 ? "none" : "2px solid #e0e0e0",
      }}
    >
      <div className="day-number">{calDay.day}</div>

      <div className="events-container">
        {(viewType === "weekly" ? weeklyEvents : calDay.events.map((event) => ({ event }))).map(
          (item) => {
            const event = item.event;
            const topInMinutes = viewType === "weekly" ? item.startMinutes : 0;
            const durationInMinutes =
              viewType === "weekly" ? Math.max(item.endMinutes - item.startMinutes, 15) : 0;
            const column = viewType === "weekly" ? item.column : 0;
            const columnsCount = viewType === "weekly" ? item.columnsCount : 1;
            const widthPercent = 100 / columnsCount;
            const leftPercent = column * widthPercent;

          return (
            <div
              key={event.id}
              className="event-tile"
              onClick={() =>
                onEventClick?.({ ...event, dateDebut: event.dateDebut, dateFin: event.dateFin })
              }
              title={event.nom}
              style={{
                position: viewType === "weekly" ? "absolute" : "relative",
                top:
                  viewType === "weekly"
                    ? `${(topInMinutes / 60) * (slotHeight || 35.6)}px`
                    : "auto",
                height:
                  viewType === "weekly"
                    ? `${(durationInMinutes / 60) * (slotHeight || 35.6)}px`
                    : "auto",
                left: viewType === "weekly" ? `calc(${leftPercent}% + 4px)` : undefined,
                right: viewType === "weekly" ? "auto" : undefined,
                width: viewType === "weekly" ? `calc(${widthPercent}% - 8px)` : undefined,
              }}
            >
              <span className="event-dot" aria-hidden="true" />
              <span className="event-content">
                <span className="event-time">
                  {formatEventRange(event)}
                </span>
                <span className="event-name">{event.nom}</span>
              </span>
            </div>
          );
          }
        )}
      </div>
    </div>
  );
}
