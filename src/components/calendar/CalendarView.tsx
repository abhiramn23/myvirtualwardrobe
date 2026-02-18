'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Plus,
    Filter,
    X,
    Trash2,
    CalendarDays
} from 'lucide-react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
    eachDayOfInterval,
    parseISO
} from 'date-fns';
import { useCalendar } from '@/hooks/useCalendar';
import { useOutfits } from '@/hooks/useOutfits';
import { OCCASION_TYPES, CalendarEventType, Outfit } from '@/lib/types';
import { cn } from '@/lib/utils';

export function CalendarView() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [eventFilter, setEventFilter] = useState<CalendarEventType | 'All'>('All');

    const { entries, loading, addEntry, deleteEntry } = useCalendar();
    const { outfits } = useOutfits();

    // Modal state
    const [selectedOutfitId, setSelectedOutfitId] = useState('');
    const [selectedEventType, setSelectedEventType] = useState<CalendarEventType>('Casual');
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const onDateClick = (day: Date) => {
        setSelectedDate(day);
        setIsAddModalOpen(true);
    };

    const handleAddEvent = async () => {
        if (!selectedDate || !selectedOutfitId) return;
        setSaving(true);
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        await addEntry(selectedOutfitId, dateStr, selectedEventType, notes);
        setSaving(false);
        setIsAddModalOpen(false);
        setSelectedOutfitId('');
        setNotes('');
    };

    // Calendar logic
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const filteredEntries = entries.filter(e =>
        eventFilter === 'All' || e.event_type === eventFilter
    );

    const getEntriesForDay = (day: Date) => {
        return filteredEntries.filter(e => isSameDay(parseISO(e.event_date), day));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold font-display">{format(currentMonth, 'MMMM yyyy')}</h2>
                    <div className="flex items-center gap-1">
                        <button onClick={prevMonth} className="p-2 hover:bg-secondary rounded-full transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={nextMonth} className="p-2 hover:bg-secondary rounded-full transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <select
                            value={eventFilter}
                            onChange={(e) => setEventFilter(e.target.value as any)}
                            className="pl-9 pr-4 py-2 bg-secondary/50 border border-border rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            <option value="All">All Events</option>
                            {OCCASION_TYPES.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        <Filter className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                {/* Day headers */}
                <div className="grid grid-cols-7 border-b border-border bg-secondary/30">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7">
                    {calendarDays.map((day: Date, idx: number) => {
                        const isCurrentMonth = isSameMonth(day, monthStart);
                        const dayEntries = getEntriesForDay(day);
                        const isToday = isSameDay(day, new Date());

                        return (
                            <div
                                key={day.toString()}
                                className={cn(
                                    "min-h-[120px] p-2 border-r border-b border-border transition-colors group relative",
                                    !isCurrentMonth && "bg-secondary/20",
                                    isCurrentMonth && "hover:bg-secondary/10"
                                )}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className={cn(
                                        "text-sm font-medium",
                                        !isCurrentMonth && "text-muted-foreground/50",
                                        isToday && "w-7 h-7 flex items-center justify-center bg-primary text-primary-foreground rounded-full"
                                    )}>
                                        {format(day, 'd')}
                                    </span>
                                    {isCurrentMonth && (
                                        <button
                                            onClick={() => onDateClick(day)}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-primary/10 rounded-lg text-primary transition-all"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    {dayEntries.map(entry => (
                                        <div
                                            key={entry.id}
                                            className="group/entry relative px-2 py-1 rounded-md bg-primary/10 border border-primary/20 text-[10px] sm:text-xs leading-tight"
                                        >
                                            <p className="font-semibold text-primary truncate">{entry.outfit?.name}</p>
                                            <p className="text-muted-foreground opacity-80">{entry.event_type}</p>
                                            <button
                                                onClick={() => deleteEntry(entry.id)}
                                                className="absolute top-1 right-1 opacity-0 group-hover/entry:opacity-100 p-0.5 hover:text-destructive transition-all"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Add Event Modal */}
            <AnimatePresence>
                {isAddModalOpen && selectedDate && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
                        />
                        <motion.div
                            className="relative w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-xl"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold font-display flex items-center gap-2">
                                    <CalendarDays className="w-5 h-5 text-primary" />
                                    Assign Outfit
                                </h3>
                                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-secondary rounded-xl transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="p-3 bg-secondary/50 rounded-xl border border-border">
                                    <p className="text-xs text-muted-foreground uppercase font-semibold">Selected Date</p>
                                    <p className="font-medium">{format(selectedDate, 'EEEE, MMMM do, yyyy')}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Select Outfit</label>
                                    <select
                                        value={selectedOutfitId}
                                        onChange={(e) => setSelectedOutfitId(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                    >
                                        <option value="">Choose an outfit...</option>
                                        {outfits.map(o => (
                                            <option key={o.id} value={o.id}>{o.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Event Type</label>
                                    <select
                                        value={selectedEventType}
                                        onChange={(e) => setSelectedEventType(e.target.value as any)}
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                    >
                                        {OCCASION_TYPES.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Notes (Optional)</label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Add more details about the event..."
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
                                    />
                                </div>

                                <button
                                    onClick={handleAddEvent}
                                    disabled={saving || !selectedOutfitId}
                                    className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 mt-4 shadow-lg shadow-primary/20"
                                >
                                    {saving ? 'Assigning...' : 'Assign Outfit to Calendar'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
