// src/components/ClientSideDayPicker.tsx
'use client'; // This directive is crucial for client components in Next.js 13+

import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';

// Re-defining interface for clarity, you might want to share this via a common types file
interface DateRangePickerProps {
    startDate: Date | undefined;
    endDate: Date | undefined;
    isEndDatePresent: boolean;
    handleDayClick: (day: Date) => void;
    handlePresentToggle: () => void;
    setShowPicker: (show: boolean) => void;
}

const ClientSideDayPicker = ({
    startDate,
    endDate,
    isEndDatePresent,
    handleDayClick,
    handlePresentToggle,
    setShowPicker,
}: DateRangePickerProps) => {
    return (
        <div className="absolute z-10 top-full mt-2 bg-white/70 dark:bg-black/40 backdrop-blur-md border border-border rounded-xl shadow-2xl p-4 transition-colors">
            <DayPicker
                mode={isEndDatePresent ? "single" : "range"}
                selected={
                    isEndDatePresent
                        ? startDate
                        : { from: startDate, to: endDate }
                    as any} // Type assertion still needed here due to library's selected prop type
                onDayClick={handleDayClick}
                captionLayout="dropdown-buttons"
                fromYear={2010}
                toYear={new Date().getFullYear() + 5}
            />
            <div className="flex items-center justify-between p-2 border-t mt-2">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="present"
                        checked={isEndDatePresent}
                        onChange={handlePresentToggle}
                    />
                    <label htmlFor="present" className="text-sm text-muted-foreground">I currently work here</label>
                </div>
                <button type="button" onClick={() => setShowPicker(false)} className="text-sm btn-secondary py-1 px-3">Close</button>
            </div>
        </div>
    );
};

export default ClientSideDayPicker;