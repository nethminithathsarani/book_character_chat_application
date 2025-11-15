import * as React from 'react';

import { cn } from './utils';

function Calendar({ className, ...props }) {
  return <div data-slot="calendar" className={cn('w-full', className)} {...props} />;
}

function CalendarHeader({ className, ...props }) {
  return <div data-slot="calendar-header" className={cn('flex items-center justify-between', className)} {...props} />;
}

function CalendarGrid({ className, ...props }) {
  return <div data-slot="calendar-grid" className={cn('grid grid-cols-7 gap-1', className)} {...props} />;
}

export { Calendar, CalendarHeader, CalendarGrid };
export default Calendar;
