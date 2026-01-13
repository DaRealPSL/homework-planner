import React, { useState } from 'react';
import type { Homework } from '@/core/types/database';

interface CalendarViewProps {
  homework: Homework[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  homework,
  selectedDate,
  onDateSelect,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getHomeworkForDate = (date: Date) => {
    return homework.filter(hw => {
      const dueDate = new Date(hw.due_date);
      return dueDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    onDateSelect(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate?.toDateString() === date.toDateString();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Previous month days
    for (let i = 0; i < firstDay; i++) {
      const prevMonth = new Date(currentDate);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      const prevMonthDays = getDaysInMonth(prevMonth);
      const day = prevMonthDays - firstDay + i + 1;
      const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day);
      
      days.push(
        <button
          key={`prev-${i}`}
          onClick={() => onDateSelect(date)}
          className="aspect-square p-2 text-gray-400 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <span className="text-sm">{day}</span>
        </button>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayHomework = getHomeworkForDate(date);
      const isCurrentDay = isToday(date);
      const isSelectedDay = isSelected(date);

      days.push(
        <button
          key={day}
          onClick={() => onDateSelect(date)}
          className={`aspect-square p-2 rounded-lg transition-all relative group ${
            isCurrentDay
              ? 'bg-primary-500 text-white font-bold shadow-md'
              : isSelectedDay
              ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100 ring-2 ring-primary-500'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100'
          }`}
        >
          <span className="text-sm font-medium">{day}</span>
          {dayHomework.length > 0 && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
              {dayHomework.slice(0, 3).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1 h-1 rounded-full ${
                    isCurrentDay ? 'bg-white' : 'bg-red-500'
                  }`}
                />
              ))}
            </div>
          )}
        </button>
      );
    }

    // Next month days
    const totalCells = Math.ceil((daysInMonth + firstDay) / 7) * 7;
    const remainingCells = totalCells - (daysInMonth + firstDay);
    
    for (let i = 1; i <= remainingCells; i++) {
      const nextMonth = new Date(currentDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const date = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i);
      
      days.push(
        <button
          key={`next-${i}`}
          onClick={() => onDateSelect(date)}
          className="aspect-square p-2 text-gray-400 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <span className="text-sm">{i}</span>
        </button>
      );
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 transition-colors">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg font-medium transition-colors"
          >
            Today
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {dayNames.map(day => (
          <div key={day} className="text-center py-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {renderCalendar()}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-400">Has homework</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary-500 rounded-lg"></div>
          <span className="text-gray-600 dark:text-gray-400">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary-100 dark:bg-primary-900 border-2 border-primary-500 rounded-lg"></div>
          <span className="text-gray-600 dark:text-gray-400">Selected</span>
        </div>
      </div>
    </div>
  );
};

// export default CalendarView;