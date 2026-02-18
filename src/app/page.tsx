'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shirt, ShoppingBag, BarChart3, Sparkles, ArrowRight, Heart } from 'lucide-react';

const features = [
  {
    icon: <Shirt className="w-6 h-6" />,
    title: 'Organize Your Closet',
    description: 'Categorize your wardrobe into shirts, pants, shoes, and accessories with ease.',
  },
  {
    icon: <ShoppingBag className="w-6 h-6" />,
    title: 'Wishlist & Owned',
    description: 'Track items you own and save items you desire — all linked to their store pages.',
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'Build Outfits',
    description: 'Drag and drop pieces to create stunning outfit combinations instantly.',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Track Spending',
    description: 'Monitor wardrobe value, cost-per-wear, and budget analytics in real time.',
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose" fill="currentColor" />
            <span className="font-display text-xl font-semibold tracking-tight">My Virtual Wardrobe</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Soft gradient bg */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose/20 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-champagne/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-lavender/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-medium tracking-wider uppercase bg-cream text-muted-foreground rounded-full border border-border">
              Your Personal Fashion Closet
            </span>
          </motion.div>

          <motion.h1
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Curate Your
            <br />
            <span className="gradient-text">Perfect Wardrobe</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Organize your collection, build outfits with drag & drop, track spending, and manage
            your fashion wishlist — all in one beautiful digital space.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-all hover:gap-3"
            >
              Start Your Wardrobe <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium bg-white text-foreground rounded-full border border-border hover:bg-secondary transition-colors"
            >
              Sign In
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              A complete toolkit for the fashion-conscious, designed with simplicity in mind.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="p-6 rounded-2xl bg-card border border-border card-hover"
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center mb-4 text-accent-foreground">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            className="p-12 rounded-3xl bg-gradient-to-br from-cream via-blush/30 to-lavender/30 border border-border"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl font-bold mb-4">Ready to Elevate Your Style?</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Join now and start building your dream wardrobe. It&apos;s free, forever.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-all"
            >
              Create Free Account <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose" fill="currentColor" />
            <span>My Virtual Wardrobe</span>
          </div>
          <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
