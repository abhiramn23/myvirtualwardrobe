'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Ruler, Shield, Check, X as XIcon, Globe, Lock } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useMeasurements } from '@/hooks/useMeasurements';
import { SHIRT_SIZES, BODY_TYPES } from '@/lib/types';
import { convertShoeSizeFromIndia } from '@/lib/utils';

export default function SettingsPage() {
    const { profile, loading: profileLoading, accessRequests, updateProfile, handleAccessRequest } = useProfile();
    const { measurements, loading: measurementsLoading, saveMeasurements } = useMeasurements();

    // Profile form
    const [username, setUsername] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [bio, setBio] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileSaved, setProfileSaved] = useState(false);

    // Measurements form
    const [shoeIndia, setShoeIndia] = useState('');
    const [shoeUs, setShoeUs] = useState('');
    const [shoeUk, setShoeUk] = useState('');
    const [shirtSize, setShirtSize] = useState('');
    const [pantWaist, setPantWaist] = useState('');
    const [pantLength, setPantLength] = useState('');
    const [bodyType, setBodyType] = useState('');
    const [measurementsSaving, setMeasurementsSaving] = useState(false);
    const [measurementsSaved, setMeasurementsSaved] = useState(false);

    // Pre-fill from profile
    useEffect(() => {
        if (profile) {
            setUsername(profile.username || '');
            setDisplayName(profile.display_name || '');
            setBio(profile.bio || '');
            setIsPublic(profile.is_public);
        }
    }, [profile]);

    // Pre-fill measurements
    useEffect(() => {
        if (measurements) {
            setShoeIndia(measurements.shoe_size_india?.toString() || '');
            setShoeUs(measurements.shoe_size_us?.toString() || '');
            setShoeUk(measurements.shoe_size_uk?.toString() || '');
            setShirtSize(measurements.shirt_size || '');
            setPantWaist(measurements.pant_waist?.toString() || '');
            setPantLength(measurements.pant_length?.toString() || '');
            setBodyType(measurements.body_type || '');
        }
    }, [measurements]);

    // Auto-convert shoe sizes when India size changes
    useEffect(() => {
        if (shoeIndia) {
            const converted = convertShoeSizeFromIndia(parseFloat(shoeIndia));
            setShoeUs(converted.us.toString());
            setShoeUk(converted.uk.toString());
        }
    }, [shoeIndia]);

    const saveProfile = async () => {
        setProfileSaving(true);
        await updateProfile({ username, display_name: displayName, bio, is_public: isPublic });
        setProfileSaving(false);
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 2000);
    };

    const saveMeasurementsForm = async () => {
        setMeasurementsSaving(true);
        await saveMeasurements({
            shoe_size_india: shoeIndia ? parseFloat(shoeIndia) : null,
            shoe_size_us: shoeUs ? parseFloat(shoeUs) : null,
            shoe_size_uk: shoeUk ? parseFloat(shoeUk) : null,
            shirt_size: shirtSize || null,
            pant_waist: pantWaist ? parseFloat(pantWaist) : null,
            pant_length: pantLength ? parseFloat(pantLength) : null,
            body_type: bodyType || null,
        });
        setMeasurementsSaving(false);
        setMeasurementsSaved(true);
        setTimeout(() => setMeasurementsSaved(false), 2000);
    };

    const pendingRequests = accessRequests.filter((r) => r.status === 'pending');

    if (profileLoading || measurementsLoading) {
        return (
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 w-40 bg-secondary rounded" />
                    <div className="h-64 bg-secondary rounded-2xl" />
                    <div className="h-64 bg-secondary rounded-2xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-display">Settings</h1>
                <p className="text-muted-foreground text-sm mt-1">Manage your profile and preferences</p>
            </div>

            {/* Profile Section */}
            <motion.div
                className="p-6 rounded-2xl bg-card border border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-lavender/40 flex items-center justify-center">
                        <User className="w-5 h-5 text-purple-700" />
                    </div>
                    <div>
                        <h2 className="font-semibold">Profile</h2>
                        <p className="text-xs text-muted-foreground">Your public identity</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="your-unique-username"
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Display Name</label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Your Name"
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell people about your style..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
                        />
                    </div>

                    {/* Public/Private Toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                        <div className="flex items-center gap-3">
                            {isPublic ? (
                                <Globe className="w-5 h-5 text-green-600" />
                            ) : (
                                <Lock className="w-5 h-5 text-muted-foreground" />
                            )}
                            <div>
                                <p className="text-sm font-medium">{isPublic ? 'Public Wardrobe' : 'Private Wardrobe'}</p>
                                <p className="text-xs text-muted-foreground">
                                    {isPublic ? 'Anyone can view your wardrobe' : 'Only you can see your wardrobe'}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsPublic(!isPublic)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPublic ? 'bg-primary' : 'bg-border'}`}
                        >
                            <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    <button
                        onClick={saveProfile}
                        disabled={profileSaving}
                        className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                    >
                        {profileSaved ? '✓ Saved!' : profileSaving ? 'Saving...' : 'Save Profile'}
                    </button>
                </div>
            </motion.div>

            {/* Measurements Section */}
            <motion.div
                className="p-6 rounded-2xl bg-card border border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-sage/40 flex items-center justify-center">
                        <Ruler className="w-5 h-5 text-green-700" />
                    </div>
                    <div>
                        <h2 className="font-semibold">Measurements</h2>
                        <p className="text-xs text-muted-foreground">Your body measurements for size recommendations</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Shoe sizes */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Shoe Size</label>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <span className="text-xs text-muted-foreground">India</span>
                                <input
                                    type="number"
                                    value={shoeIndia}
                                    onChange={(e) => setShoeIndia(e.target.value)}
                                    placeholder="e.g. 8"
                                    step="0.5"
                                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all mt-1"
                                />
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground">US (auto)</span>
                                <input
                                    type="number"
                                    value={shoeUs}
                                    onChange={(e) => setShoeUs(e.target.value)}
                                    placeholder="auto"
                                    step="0.5"
                                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all mt-1"
                                />
                            </div>
                            <div>
                                <span className="text-xs text-muted-foreground">UK (auto)</span>
                                <input
                                    type="number"
                                    value={shoeUk}
                                    onChange={(e) => setShoeUk(e.target.value)}
                                    placeholder="auto"
                                    step="0.5"
                                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all mt-1"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Shirt + Body type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Shirt Size</label>
                            <select
                                value={shirtSize}
                                onChange={(e) => setShirtSize(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                            >
                                <option value="">Select</option>
                                {SHIRT_SIZES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Body Type</label>
                            <select
                                value={bodyType}
                                onChange={(e) => setBodyType(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                            >
                                <option value="">Select</option>
                                {BODY_TYPES.map((b) => (
                                    <option key={b} value={b}>{b}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Pants */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Pant Waist (inches)</label>
                            <input
                                type="number"
                                value={pantWaist}
                                onChange={(e) => setPantWaist(e.target.value)}
                                placeholder="e.g. 32"
                                step="0.5"
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Pant Length (inches)</label>
                            <input
                                type="number"
                                value={pantLength}
                                onChange={(e) => setPantLength(e.target.value)}
                                placeholder="e.g. 30"
                                step="0.5"
                                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                            />
                        </div>
                    </div>

                    <button
                        onClick={saveMeasurementsForm}
                        disabled={measurementsSaving}
                        className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                    >
                        {measurementsSaved ? '✓ Saved!' : measurementsSaving ? 'Saving...' : 'Save Measurements'}
                    </button>
                </div>
            </motion.div>

            {/* Access Requests Section */}
            {pendingRequests.length > 0 && (
                <motion.div
                    className="p-6 rounded-2xl bg-card border border-border"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-champagne/40 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-amber-700" />
                        </div>
                        <div>
                            <h2 className="font-semibold">Access Requests</h2>
                            <p className="text-xs text-muted-foreground">{pendingRequests.length} pending request(s)</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {pendingRequests.map((request) => (
                            <div key={request.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                                <div>
                                    <p className="text-sm font-medium">User wants to view your wardrobe</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(request.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAccessRequest(request.id, 'accepted')}
                                        className="p-2 rounded-lg bg-sage/30 text-green-700 hover:bg-sage/50 transition-colors"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleAccessRequest(request.id, 'rejected')}
                                        className="p-2 rounded-lg bg-rose/30 text-red-700 hover:bg-rose/50 transition-colors"
                                    >
                                        <XIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
