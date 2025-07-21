// src/app/admin/experience/DateRangePicker.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import dynamic from 'next/dynamic'; // Import dynamic from next/dynamic

// Dynamically import the ClientSideDayPicker with SSR disabled
const DynamicClientSideDayPicker = dynamic(() => import('../../../components/ClientSideDayPicker'), {
    ssr: false, // This is the guard: ensures this component and its children only render on the client
});

interface DateRangePickerProps {
    initialDateString?: string;
    onDateChange: (dateString: string) => void;
}

const DateRangePicker = ({ initialDateString, onDateChange }: DateRangePickerProps) => {
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [isEndDatePresent, setIsEndDatePresent] = useState(false);
    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => {
        if (initialDateString) {
            if (initialDateString.includes('Present')) {
                const startStr = initialDateString.split(' - ')[0];
                setStartDate(new Date(startStr));
                setIsEndDatePresent(true);
                setEndDate(undefined);
            } else if (initialDateString.includes(' - ')) {
                const [startStr, endStr] = initialDateString.split(' - ');
                setStartDate(new Date(startStr));
                setEndDate(new Date(endStr));
                setIsEndDatePresent(false);
            }
        }
    }, [initialDateString]);
    
    const handleDayClick = (day: Date) => {
        if (!startDate || (startDate && endDate && !isEndDatePresent)) {
            setStartDate(day);
            setEndDate(undefined);
            setIsEndDatePresent(false);
        } 
        else if (startDate && !endDate && !isEndDatePresent) {
            if (day < startDate) {
                setEndDate(startDate);
                setStartDate(day);
            } else {
                setEndDate(day);
            }
            setShowPicker(false);
        }
    };

    useEffect(() => {
        let dateString = '';
        if (startDate) {
            dateString = format(startDate, 'MMM yyyy');
            if (isEndDatePresent) {
                dateString += ' - Present';
            } else if (endDate) {
                if (endDate >= startDate) {
                    dateString += ` - ${format(endDate, 'MMM yyyy')}`;
                }
            }
        }
        onDateChange(dateString);
    }, [startDate, endDate, isEndDatePresent, onDateChange]);

    const handlePresentToggle = () => {
        const newPresentState = !isEndDatePresent;
        setIsEndDatePresent(newPresentState);
        if (newPresentState) {
            setEndDate(undefined);
        }
    };

    const displayValue = () => {
        if (startDate) {
            let text = format(startDate, 'MMM yyyy');
            if (isEndDatePresent) return `${text} - Present`;
            if (endDate) return `${text} - ${format(endDate, 'MMM yyyy')}`;
            return text;
        }
        return 'Select date range...';
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={displayValue()}
                onFocus={() => setShowPicker(true)}
                readOnly
                className="w-full bg-white/70 dark:bg-black/40 border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground shadow-sm backdrop-blur-md transition-colors cursor-pointer"
            />
            {showPicker && (
                <DynamicClientSideDayPicker
                    startDate={startDate}
                    endDate={endDate}
                    isEndDatePresent={isEndDatePresent}
                    handleDayClick={handleDayClick}
                    handlePresentToggle={handlePresentToggle}
                    setShowPicker={setShowPicker}
                />
            )}
        </div>
    );
};

export default DateRangePicker;