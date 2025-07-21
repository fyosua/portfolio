'use client';

import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';

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
        <div className="absolute z-10 top-full mt-2 bg-white/70 dark:bg-black/40 backdrop-blur-md border border-border rounded-xl shadow-2xl p-4 transition-colors">
          <DayPicker
            mode={isEndDatePresent ? "single" : "range"}
            selected={
              isEndDatePresent
                ? startDate
                : { from: startDate, to: endDate }
            }
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
      )}
    </div>
  );
};

export default DateRangePicker;