'use client';

import { motion } from 'framer-motion';
import { Lightbulb, Shirt, Palette, DollarSign, Sun, Tags } from 'lucide-react';
import { OCCASION_TYPES, SEASONS } from '@/lib/types';

const placeholderSections = [
    {
        icon: <Shirt className="w-5 h-5" />,
        title: 'Occasion',
        description: 'Get outfit suggestions for any event',
        items: OCCASION_TYPES,
        color: 'bg-champagne/40 text-amber-700',
    },
    {
        icon: <Palette className="w-5 h-5" />,
        title: 'Color Preference',
        description: 'Filter by your favorite color palettes',
        items: ['Neutral', 'Earth Tones', 'Bold', 'Pastel', 'Monochrome'],
        color: 'bg-lavender/40 text-purple-700',
    },
    {
        icon: <DollarSign className="w-5 h-5" />,
        title: 'Budget Range',
        description: 'Set your budget for outfit combinations',
        items: ['Under $50', '$50 - $100', '$100 - $250', '$250+'],
        color: 'bg-sage/40 text-green-700',
    },
    {
        icon: <Sun className="w-5 h-5" />,
        title: 'Season',
        description: 'Season-appropriate outfit ideas',
        items: SEASONS,
        color: 'bg-blush/40 text-pink-700',
    },
    {
        icon: <Tags className="w-5 h-5" />,
        title: 'Style Tags',
        description: 'Match outfits by style',
        items: ['Minimalist', 'Streetwear', 'Formal', 'Bohemian', 'Sporty', 'Vintage'],
        color: 'bg-rose/40 text-red-700',
    },
];

export default function SuggestionsPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold font-display">Suggestions</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    AI-powered outfit recommendations tailored to you
                </p>
            </div>

            {/* Coming Soon Banner */}
            <motion.div
                className="p-8 rounded-2xl bg-gradient-to-br from-lavender/30 via-cream to-blush/20 border border-border text-center mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Lightbulb className="w-10 h-10 text-amber-500 mx-auto mb-4" />
                <h2 className="font-display text-2xl font-bold mb-2">Coming Soon</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Our AI-powered suggestion engine is being built. Soon you&apos;ll get personalized outfit
                    recommendations based on your wardrobe, style preferences, and occasions.
                </p>
            </motion.div>

            {/* Placeholder Sections */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {placeholderSections.map((section, index) => (
                    <motion.div
                        key={section.title}
                        className="p-5 rounded-2xl bg-card border border-border opacity-60"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 0.6, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${section.color}`}>
                                {section.icon}
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">{section.title}</h3>
                                <p className="text-xs text-muted-foreground">{section.description}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {section.items.map((item) => (
                                <span
                                    key={item}
                                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground cursor-not-allowed"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
