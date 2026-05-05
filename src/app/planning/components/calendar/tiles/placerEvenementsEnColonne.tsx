import { CalendarDay } from "../calendar";
import { PositionedEvent } from "./calendar-tiles";


export function placerEvenementsEnColonne(viewType: "monthly" | "weekly", calDay: CalendarDay): PositionedEvent[] {
    if (viewType === "weekly") {
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

            while (
              groupEnd < baseEvents.length &&
              baseEvents[groupEnd].startMinutes < maxEndInGroup
            ) {
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
        
    } else {
        return []
    }
}