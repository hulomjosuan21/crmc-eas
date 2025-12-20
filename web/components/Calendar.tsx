"use client";
import { useState, useMemo } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  eachWeekOfInterval,
  isSameMonth,
  isSameDay,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  parseISO,
  setHours,
  setMinutes,
  differenceInMinutes,
  startOfDay,
  endOfDay,
  isToday,
  isBefore,
  isAfter,
  getDay,
  differenceInCalendarDays,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ButtonGroup } from "@/components/ui/button-group";

type ViewType = "day" | "week" | "month";

type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  originalStart?: Date;
  originalEnd?: Date;
};

const generateMockEvents = (): Event[] => {
  return [];
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>("month");
  const [events, setEvents] = useState<Event[]>(generateMockEvents());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
    startTime: "09:00",
    endTime: "10:00",
    color: "#7f1d1d", // Dark Red default like image
  });

  const headerDate = useMemo(() => {
    if (view === "month") return format(currentDate, "MMMM yyyy");
    if (view === "week") {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
    }
    if (view === "day") return format(currentDate, "MMMM d, yyyy");
    return "";
  }, [currentDate, view]);

  const handlePrev = () => {
    if (view === "month") setCurrentDate(subMonths(currentDate, 1));
    if (view === "week") setCurrentDate(subWeeks(currentDate, 1));
    if (view === "day") setCurrentDate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (view === "month") setCurrentDate(addMonths(currentDate, 1));
    if (view === "week") setCurrentDate(addWeeks(currentDate, 1));
    if (view === "day") setCurrentDate(addDays(currentDate, 1));
  };

  const handleToday = () => setCurrentDate(new Date());

  const handleAddEvent = () => {
    const startBase = parseISO(newEvent.startDate);
    const [startHour, startMin] = newEvent.startTime.split(":").map(Number);
    const start = setMinutes(setHours(startBase, startHour), startMin);

    const endBase = parseISO(newEvent.endDate);
    const [endHour, endMin] = newEvent.endTime.split(":").map(Number);
    const end = setMinutes(setHours(endBase, endHour), endMin);

    if (isBefore(end, start)) {
      alert("End time must be after start time");
      return;
    }

    const payload: Event = {
      id: Math.random().toString(36).substr(2, 9),
      title: newEvent.title || "New Event",
      start,
      end,
      color: newEvent.color,
    };

    setEvents([...events, payload]);
    setIsDialogOpen(false);
    setNewEvent({ ...newEvent, title: "" });
  };

  const viewDays = useMemo(() => {
    if (view === "day") return [currentDate];
    if (view === "week") {
      return eachDayOfInterval({
        start: startOfWeek(currentDate),
        end: endOfWeek(currentDate),
      });
    }
    return [];
  }, [currentDate, view]);

  const HOUR_HEIGHT = 64;

  const getEventStyle = (event: Event) => {
    const startOfDayDate = startOfDay(event.start);
    const minutesFromStart = differenceInMinutes(event.start, startOfDayDate);
    const durationMinutes = differenceInMinutes(event.end, event.start);

    const top = (minutesFromStart / 60) * HOUR_HEIGHT;
    const height = (durationMinutes / 60) * HOUR_HEIGHT;

    return {
      top: `${top}px`,
      height: `${height}px`,
      backgroundColor: event.color,
    };
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd });

    const MAX_EVENTS_VISIBLE = 3;

    return (
      <div className="flex flex-col bg-card rounded-lg border">
        {/* Header Days */}
        <div className="grid grid-cols-7 border-b bg-muted/40">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="h-10 flex items-center justify-center text-sm font-semibold text-muted-foreground border-r last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Weeks */}
        <div className="flex flex-col">
          {weeks.map((weekStart) => {
            const weekEnd = endOfWeek(weekStart);
            const daysInWeek = eachDayOfInterval({
              start: weekStart,
              end: weekEnd,
            });

            // --- Event Logic ---
            const weekEvents = events.filter((event) => {
              const eventStart = startOfDay(event.start);
              const eventEnd = endOfDay(event.end);
              return (
                (isSameDay(weekStart, eventEnd) ||
                  isBefore(weekStart, eventEnd)) &&
                (isSameDay(weekEnd, eventStart) || isAfter(weekEnd, eventStart))
              );
            });

            weekEvents.sort((a, b) => {
              const startDiff = a.start.getTime() - b.start.getTime();
              if (startDiff !== 0) return startDiff;
              const durationA = a.end.getTime() - a.start.getTime();
              const durationB = b.end.getTime() - b.start.getTime();
              if (durationB - durationA !== 0) return durationB - durationA;
              return a.title.localeCompare(b.title);
            });

            const slots: Event[][] = [];
            const eventsOverlap = (e1: Event, e2: Event) => {
              const start1 = startOfDay(
                isBefore(e1.start, weekStart) ? weekStart : e1.start
              );
              const end1 = endOfDay(
                isAfter(e1.end, weekEnd) ? weekEnd : e1.end
              );
              const start2 = startOfDay(
                isBefore(e2.start, weekStart) ? weekStart : e2.start
              );
              const end2 = endOfDay(
                isAfter(e2.end, weekEnd) ? weekEnd : e2.end
              );
              return isBefore(start1, end2) && isAfter(end1, start2);
            };

            const eventsWithSlots = weekEvents.map((event) => {
              let slotIndex = 0;
              while (true) {
                const slotEvents = slots[slotIndex] || [];
                const hasOverlap = slotEvents.some((existing) =>
                  eventsOverlap(existing, event)
                );
                if (!hasOverlap) {
                  if (!slots[slotIndex]) slots[slotIndex] = [];
                  slots[slotIndex].push(event);
                  return { event, slotIndex };
                }
                slotIndex++;
              }
            });

            return (
              <div
                key={weekStart.toString()}
                className="relative border-b last:border-b-0 w-full min-h-[180px]"
              >
                {/* Background Grid & Day Numbers */}
                <div className="absolute inset-0 grid grid-cols-7 w-full h-full z-0">
                  {daysInWeek.map((day) => {
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const eventsOnThisDay = weekEvents.filter((e) => {
                      const s = startOfDay(e.start);
                      const end = endOfDay(e.end);
                      const d = startOfDay(day);
                      return (
                        (isSameDay(d, s) || isAfter(d, s)) &&
                        (isSameDay(d, end) || isBefore(d, end))
                      );
                    });
                    const hiddenCount =
                      eventsOnThisDay.length - MAX_EVENTS_VISIBLE;

                    return (
                      <div
                        key={day.toString()}
                        className={`border-r last:border-r-0 p-2 flex flex-col justify-between transition-colors hover:bg-muted/5 ${
                          !isCurrentMonth ? "bg-muted/10" : ""
                        }`}
                        onDoubleClick={() => {
                          setNewEvent({
                            ...newEvent,
                            startDate: format(day, "yyyy-MM-dd"),
                            endDate: format(day, "yyyy-MM-dd"),
                          });
                          setIsDialogOpen(true);
                        }}
                      >
                        {/* Day Number */}
                        <div className="flex justify-end h-8">
                          <span
                            className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                              isSameDay(day, new Date())
                                ? "bg-primary text-primary-foreground"
                                : isCurrentMonth
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {format(day, "d")}
                          </span>
                        </div>

                        {/* "+ More" Indicator (Stays at bottom) */}
                        {hiddenCount > 0 && (
                          <div
                            className="text-[10px] font-medium text-muted-foreground pl-1 mb-1 cursor-pointer hover:text-foreground hover:underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentDate(day);
                              setView("day");
                            }}
                          >
                            +{hiddenCount} more...
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="relative z-10 w-full mt-12 flex flex-col pointer-events-none">
                  {eventsWithSlots.map(({ event, slotIndex }) => {
                    if (slotIndex >= MAX_EVENTS_VISIBLE) return null;

                    const dayStart = startOfDay(event.start);
                    const dayEnd = endOfDay(event.end);
                    const visualStart = isBefore(dayStart, weekStart)
                      ? weekStart
                      : dayStart;
                    const visualEnd = isAfter(dayEnd, weekEnd)
                      ? weekEnd
                      : dayEnd;
                    const startDayIndex = getDay(visualStart);
                    const spanDays =
                      differenceInCalendarDays(visualEnd, visualStart) + 1;
                    const left = `${startDayIndex * 14.28}%`;
                    const width = `${spanDays * 14.28}%`;
                    const isContinuationLeft = isBefore(dayStart, weekStart);
                    const isContinuationRight = isAfter(dayEnd, weekEnd);

                    return (
                      <div
                        key={event.id}
                        className={`absolute h-6 px-2 rounded-sm text-xs text-white font-medium flex items-center overflow-hidden whitespace-nowrap pointer-events-auto cursor-pointer hover:opacity-90 transition-opacity hover:z-50
                                    ${
                                      isContinuationLeft
                                        ? "rounded-l-none border-l-2 border-white/20"
                                        : "ml-1"
                                    }
                                    ${
                                      isContinuationRight
                                        ? "rounded-r-none border-r-2 border-white/20"
                                        : "mr-1"
                                    }
                                `}
                        style={{
                          left,
                          width: `calc(${width} - 4px)`,
                          top: `${slotIndex * 28}px`,
                          backgroundColor: event.color,
                        }}
                      >
                        <span className="truncate w-full shadow-sm">
                          {event.title}
                          {!isContinuationLeft && (
                            <span className="opacity-75 ml-1 font-normal text-[10px]">
                              {format(event.start, "h:mm a")}
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getLayoutEvents = (dayEvents: Event[]) => {
    const MAX_EVENTS_VISIBLE = 3;

    // 1. Sort events
    const sorted = [...dayEvents].sort((a, b) => {
      if (a.start.getTime() === b.start.getTime()) {
        return (
          b.end.getTime() -
          b.start.getTime() -
          (a.end.getTime() - a.start.getTime())
        );
      }
      return a.start.getTime() - b.start.getTime();
    });

    // 2. Group into columns
    const columns: Event[][] = [];
    for (const event of sorted) {
      let placed = false;
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        const lastEventInCol = col[col.length - 1];
        if (event.start >= lastEventInCol.end) {
          col.push(event);
          placed = true;
          break;
        }
      }
      if (!placed) {
        columns.push([event]);
      }
    }

    const displayColumns = columns.slice(0, MAX_EVENTS_VISIBLE);

    return displayColumns.flatMap((col, colIndex) =>
      col.map((event) => ({
        event,
        style: {
          left: `${(colIndex / displayColumns.length) * 100}%`,
          width: `${100 / displayColumns.length}%`,
        },
      }))
    );
  };

  const TimeGridView = () => {
    const timeSlots = Array.from({ length: 24 }, (_, i) => i);

    const formatTime = (hour: number) => {
      const date = new Date();
      date.setHours(hour, 0, 0, 0);
      return format(date, "h a");
    };

    return (
      <div className="flex flex-col flex-1 h-0 border rounded-lg bg-card overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col min-w-[600px] bg-card">
            <div className="flex sticky top-0 z-50 border-b bg-card">
              <div className="w-16 shrink-0 border-r bg-card" />
              <div
                className={`flex-1 grid ${
                  view === "week" ? "grid-cols-7" : "grid-cols-1"
                } divide-x border-r`}
              >
                {viewDays.map((day) => (
                  <div
                    key={day.toString()}
                    className={`h-10 flex items-center justify-center text-sm font-medium bg-card ${
                      isToday(day) ? "text-primary" : ""
                    }`}
                  >
                    {format(day, "EEE d")}
                  </div>
                ))}
              </div>
            </div>

            <div
              className="flex relative bg-background"
              style={{ height: `${24 * HOUR_HEIGHT}px` }}
            >
              <div className="w-16 shrink-0 border-r flex flex-col select-none bg-background z-30">
                {timeSlots.map((hour) => (
                  <div
                    key={hour}
                    className="relative box-border"
                    style={{ height: `${HOUR_HEIGHT}px` }}
                  >
                    <span
                      className={`absolute right-2 text-xs text-muted-foreground bg-background px-1 z-20 
                      ${hour === 0 ? "top-1" : "top-0 -translate-y-1/2"} 
                      `}
                    >
                      {formatTime(hour)}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className={`flex-1 grid ${
                  view === "week" ? "grid-cols-7" : "grid-cols-1"
                } divide-x border-r relative`}
              >
                <div className="absolute inset-0 w-full pointer-events-none z-0">
                  {timeSlots.map((hour) => (
                    <div
                      key={`grid-${hour}`}
                      className="border-t border-dashed border-border/30 w-full"
                      style={{ height: `${HOUR_HEIGHT}px` }}
                    />
                  ))}
                </div>

                {viewDays.map((day) => {
                  const dayStart = startOfDay(day);
                  const dayEnd = endOfDay(day);

                  const rawEvents = events.filter(
                    (e) => isBefore(e.start, dayEnd) && isAfter(e.end, dayStart)
                  );

                  const clampedEvents = rawEvents.map((e) => ({
                    ...e,
                    originalStart: e.start,
                    originalEnd: e.end,
                    start: isBefore(e.start, dayStart) ? dayStart : e.start,
                    end: isAfter(e.end, dayEnd) ? dayEnd : e.end,
                  }));

                  const layoutEvents = getLayoutEvents(clampedEvents);

                  return (
                    <div
                      key={day.toString()}
                      className="relative w-full h-full z-10"
                    >
                      {layoutEvents.map(({ event, style: layoutStyle }) => (
                        <div
                          key={event.id}
                          className="absolute rounded-sm px-2 py-1 text-xs overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border-l-2 border-t border-r border-b border-background/20"
                          style={{
                            ...getEventStyle(event),
                            ...layoutStyle,
                          }}
                        >
                          <div className="font-semibold text-[11px] leading-3 mb-0.5 truncate text-white">
                            {event.title}
                          </div>
                          <div className="text-[10px] leading-none truncate text-white/80">
                            {format(event.originalStart || event.start, "h:mm")}
                            - {format(event.originalEnd || event.end, "h:mm a")}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  };

  return (
    <div className="flex flex-col text-foreground p-6 gap-4 h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-semibold bg-card px-4 py-2 rounded-lg border min-w-[200px] text-center">
            {headerDate}
          </h2>
          <div className="flex items-center rounded-md border bg-card">
            <Button variant="ghost" size="icon" onClick={handlePrev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border" />
            <Button variant="ghost" size="icon" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleToday}>
            Today
          </Button>
          <ButtonGroup>
            <Button
              variant={view === "day" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setView("day")}
            >
              Day
            </Button>
            <Button
              variant={view === "week" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setView("week")}
            >
              Week
            </Button>
            <Button
              variant={view === "month" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setView("month")}
            >
              Month
            </Button>
          </ButtonGroup>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" /> Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Event Title</Label>
                  <Input
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                    placeholder="Title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={newEvent.startDate}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, startDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={newEvent.endDate}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, endDate: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={newEvent.startTime}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, startTime: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={newEvent.endTime}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, endTime: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Color</Label>
                  <Input
                    type="color"
                    className="h-10 w-20"
                    value={newEvent.color}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, color: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddEvent}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {view === "month" ? (
        <div className="pb-4">{renderMonthView()}</div>
      ) : (
        TimeGridView()
      )}
    </div>
  );
}
