import { Suspense } from 'react';
import { CapsuleView } from '@/components/capsules/CapsuleView';
import { Sparkles } from 'lucide-react';

export const metadata = {
    title: 'Seasonal Capsules | Virtual Wardrobe',
    description: 'Organize your wardrobe into curated seasonal subsets.',
};

export default function CapsulesPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold font-display">Seasonal Capsules</h1>
                </div>
                <p className="text-muted-foreground text-sm">
                    Curate your collection for specific seasons or occasions.
                </p>
            </div>

            <Suspense fallback={<div className="h-48 bg-secondary/20 rounded-2xl animate-pulse" />}>
                <CapsuleView />
            </Suspense>
        </div>
    );
}
