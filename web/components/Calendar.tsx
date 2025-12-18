"use client";
import { useState, useMemo, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
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
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Plus,
} from "lucide-react";

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
import { ScrollArea } from "./ui/scroll-area";

// --- Types ---
type ViewType = "day" | "week" | "month";

type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
};

// --- Mock Data Generator ---
const generateMockEvents = (): Event[] => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  // Helper to create date with specific time
  const createDate = (day: number, hour: number, minute: number) =>
    new Date(year, month, day, hour, minute);

  return [
    {
      id: "1",
      title: "Staff Meeting",
      start: createDate(today.getDate(), 9, 0),
      end: createDate(today.getDate(), 10, 30),
      color: "#ef4444",
    },
    {
      id: "2",
      title: "Deep Tissue Massage",
      start: createDate(today.getDate(), 13, 0),
      end: createDate(today.getDate(), 14, 15),
      color: "#b91c1c",
    },
    {
      id: "3",
      title: "Microblading Session",
      start: createDate(today.getDate() + 1, 10, 0),
      end: createDate(today.getDate() + 1, 12, 0),
      color: "#15803d",
    },
    {
      id: "4",
      title: "Consultation",
      start: createDate(today.getDate() + 2, 14, 0),
      end: createDate(today.getDate() + 2, 14, 45),
      color: "#334155",
    },
    {
      id: "5",
      title: "Laser Hair Removal",
      start: createDate(today.getDate() + 3, 16, 0),
      end: createDate(today.getDate() + 3, 17, 30),
      color: "#1d4ed8",
    },
    // Overlapping event for demo
    {
      id: "6",
      title: "Quick Checkup",
      start: createDate(today.getDate(), 9, 30),
      end: createDate(today.getDate(), 10, 0),
      color: "#a16207",
    },
  ];
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>("month");
  const [events, setEvents] = useState<Event[]>(generateMockEvents());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "09:00",
    endTime: "10:00",
    color: "#3b82f6",
  });

  // --- Navigation Logic ---
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

  // --- Event Handling ---
  const handleAddEvent = () => {
    const baseDate = parseISO(newEvent.date);
    const [startHour, startMin] = newEvent.startTime.split(":").map(Number);
    const [endHour, endMin] = newEvent.endTime.split(":").map(Number);

    const start = setMinutes(setHours(baseDate, startHour), startMin);
    const end = setMinutes(setHours(baseDate, endHour), endMin);

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

  // --- View Generators ---

  // 1. Month View Logic
  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);

  // 2. Week/Day View Logic
  const timeSlots = Array.from({ length: 24 }, (_, i) => i); // 0 to 23 hours
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

  // Helper to position events in the time grid
  const getEventStyle = (event: Event) => {
    const startOfDayDate = startOfDay(event.start);
    const minutesFromStart = differenceInMinutes(event.start, startOfDayDate);
    const durationMinutes = differenceInMinutes(event.end, event.start);

    return {
      top: `${(minutesFromStart / 60) * 5}rem`,
      height: `${(durationMinutes / 60) * 5}rem`,
      backgroundColor: event.color,
    };
  };

  const renderMonthView = () => (
    <div className="grid grid-cols-7 flex-1 auto-rows-fr bg-card rounded-lg border shadow-sm overflow-hidden">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div
          key={day}
          className="p-2 text-center font-medium text-muted-foreground text-sm border-b"
        >
          {day}
        </div>
      ))}
      {monthDays.map((day, idx) => {
        const dayEvents = events.filter((e) => isSameDay(e.start, day));
        const isCurrentMonth = isSameMonth(day, currentDate);
        return (
          <div
            key={day.toString()}
            className={`min-h-[120px] border-b border-r p-2 flex flex-col gap-1 ${
              !isCurrentMonth ? "bg-muted/10 text-muted-foreground" : ""
            }`}
          >
            <span
              className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                isSameDay(day, new Date())
                  ? "bg-primary text-primary-foreground"
                  : ""
              }`}
            >
              {format(day, "d")}
            </span>
            <div className="flex flex-col gap-1 mt-1">
              {dayEvents.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className="px-2 py-0.5 rounded text-[10px] font-medium truncate"
                  style={{ backgroundColor: event.color }}
                >
                  {event.title}
                </div>
              ))}
              {dayEvents.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{dayEvents.length - 3} more
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderTimeGridView = () => (
    <div className="flex flex-1 h-0 border rounded-lg bg-card shadow-sm overflow-hidden">
      <ScrollArea className="w-full h-full">
        <div className="flex min-w-[800px]">
          {/* Time Labels Column */}
          <div className="w-16 shrink-0 border-r bg-muted/5 flex flex-col pt-10">
            {timeSlots.map((hour) => (
              <div
                key={hour}
                className="h-20 text-xs text-muted-foreground text-right pr-2 -mt-2.5"
              >
                {format(setHours(new Date(), hour), "h a")}
              </div>
            ))}
          </div>

          <div
            className={`flex-1 grid ${
              view === "week" ? "grid-cols-7" : "grid-cols-1"
            } divide-x`}
          >
            {viewDays.map((day) => {
              const dayEvents = events.filter((e) => isSameDay(e.start, day));
              return (
                <div key={day.toString()} className="relative min-w-[100px]">
                  <div className="h-10 border-b flex items-center justify-center sticky top-0 bg-card z-10 shadow-sm">
                    <div
                      className={`text-sm font-medium ${
                        isSameDay(day, new Date()) ? "text-primary" : ""
                      }`}
                    >
                      {format(day, "EEE d")}
                    </div>
                  </div>

                  <div className="relative">
                    {timeSlots.map((hour) => (
                      <div
                        key={hour}
                        className="h-20 border-b border-dashed border-border/50"
                      />
                    ))}

                    {/* Events */}
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="absolute left-1 right-1 rounded px-2 py-1 text-xs text-white overflow-hidden shadow-md cursor-pointer hover:brightness-110 z-0 opacity-90"
                        style={getEventStyle(event)}
                      >
                        <div className="font-semibold">{event.title}</div>
                        <div className="text-[10px] opacity-90">
                          {format(event.start, "h:mm a")} -{" "}
                          {format(event.end, "h:mm a")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-background text-foreground p-6 gap-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CalendarIcon className="w-8 h-8" /> Calendar
          </h1>
          <p className="text-muted-foreground">
            Manage your events and meetings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted rounded-md border p-1">
            <Button
              variant={view === "day" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("day")}
            >
              Day
            </Button>
            <Button
              variant={view === "week" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("week")}
            >
              Week
            </Button>
            <Button
              variant={view === "month" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("month")}
            >
              Month
            </Button>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
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
                <div className="grid gap-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, date: e.target.value })
                    }
                  />
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

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold bg-card px-4 py-2 rounded-lg border shadow-sm min-w-[200px] text-center">
            {headerDate}
          </h2>
          <div className="flex items-center rounded-md border bg-card shadow-sm">
            <Button variant="ghost" size="icon" onClick={handlePrev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border" />
            <Button variant="ghost" size="icon" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button variant="outline" onClick={handleToday}>
          Today
        </Button>
      </div>

      {view === "month" ? renderMonthView() : renderTimeGridView()}
    </div>
  );
}
