import { Suspense } from 'react';
import { CalendarView } from '@/components/calendar/CalendarView';
import { Sparkles } from 'lucide-react';

export const metadata = {
    title: 'Outfit Calendar | Virtual Wardrobe',
    description: 'Plan your outfits and track your wear history with ease.',
};

export default function CalendarPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="mb-8">
                <div className="flex items-center gap-2 text-primary mb-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm font-semibold uppercase tracking-wider">Engagement Mode</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-tight">Outfit Calendar</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                    Schedule your looks for upcoming events. Items in planned outfits will automatically
                    increment their wear count once the date has passed.
                </p>
            </div>

            <Suspense fallback={
                <div className="w-full h-[600px] bg-secondary/20 rounded-2xl animate-pulse flex items-center justify-center">
                    <p className="text-muted-foreground">Loading calendar...</p>
                </div>
            }>
                <CalendarView />
            </Suspense>
        </div>
    );
}
