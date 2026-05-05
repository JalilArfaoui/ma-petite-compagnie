import isToday from "../methods/isToday";
import { CalendarDay, EvenementBuiltInt } from "../calendar";
import { placerEvenementsEnColonne } from "./placerEvenementsEnColonne";

export type PositionedEvent = {
  event: EvenementBuiltInt;
  startMinutes: number;
  endMinutes: number;
  column: number;
  columnsCount: number;
};

export default function CalendarTile({
  calDay,
  index,
  viewType,
  onEventClick,
  slotHeight,
}: {
  calDay: CalendarDay;
  index: number;
  onEventClick?: (
    event: EvenementBuiltInt,
    context?: {
      anchorRect: DOMRect;
      popupTheme?: {
        backgroundColor: string;
        borderColor: string;
        textColor: string;
        accentColor: string;
      };
    }
  ) => void;
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

  const weeklyEvents: PositionedEvent[] = placerEvenementsEnColonne(viewType, calDay);

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
        {viewType === "weekly"
          ? weeklyEvents.map((item) => {
              const event = item.event;
              const topInMinutes = item.startMinutes;
              const durationInMinutes = Math.max(item.endMinutes - item.startMinutes, 15);
              const widthPercent = 100 / item.columnsCount;
              const leftPercent = item.column * widthPercent;

              return (
                <div
                  key={event.id}
                  className="event-tile"
                  onClick={(clickEvent) => {
                    const tile = clickEvent.currentTarget;
                    const computedTileStyles = window.getComputedStyle(tile);
                    const dot = tile.querySelector<HTMLElement>(".event-dot");
                    const dotStyles = dot ? window.getComputedStyle(dot) : null;

                    onEventClick?.(
                      { ...event, dateDebut: event.dateDebut, dateFin: event.dateFin },
                      {
                        anchorRect: tile.getBoundingClientRect(),
                        popupTheme: {
                          backgroundColor: computedTileStyles.backgroundColor,
                          borderColor: computedTileStyles.borderColor,
                          textColor: computedTileStyles.color,
                          accentColor: dotStyles?.backgroundColor || computedTileStyles.borderColor,
                        },
                      }
                    );
                  }}
                  title={event.nom}
                  style={{
                    position: "absolute",
                    top: `${(topInMinutes / 60) * (slotHeight || 35.6)}px`,
                    height: `${(durationInMinutes / 60) * (slotHeight || 35.6)}px`,
                    left: `calc(${leftPercent}% + 4px)`,
                    right: "auto",
                    width: `calc(${widthPercent}% - 8px)`,
                  }}
                >
                  <span className="event-dot" aria-hidden="true" />
                  <span className="event-content">
                    <span className="event-time">{formatEventRange(event)}</span>
                    <span className="event-name">{event.nom}</span>
                  </span>
                </div>
              );
            })
          : calDay.events.map((event) => (
              <div
                key={event.id}
                className="event-tile"
                onClick={(clickEvent) => {
                  const tile = clickEvent.currentTarget;
                  const computedTileStyles = window.getComputedStyle(tile);
                  const dot = tile.querySelector<HTMLElement>(".event-dot");
                  const dotStyles = dot ? window.getComputedStyle(dot) : null;

                  onEventClick?.(
                    { ...event, dateDebut: event.dateDebut, dateFin: event.dateFin },
                    {
                      anchorRect: tile.getBoundingClientRect(),
                      popupTheme: {
                        backgroundColor: computedTileStyles.backgroundColor,
                        borderColor: computedTileStyles.borderColor,
                        textColor: computedTileStyles.color,
                        accentColor: dotStyles?.backgroundColor || computedTileStyles.borderColor,
                      },
                    }
                  );
                }}
                title={event.nom}
                style={{
                  position: "relative",
                }}
              >
                <span className="event-dot" aria-hidden="true" />
                <span className="event-content">
                  <span className="event-time">{formatEventRange(event)}</span>
                  <span className="event-name">{event.nom}</span>
                </span>
              </div>
            ))}
      </div>
    </div>
  );
}
