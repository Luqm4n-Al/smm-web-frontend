// src/features/dashboard/components/Scheduling/CalendarView.tsx
'use client';

import { CustomCalendar } from './CustomCalendar'

// Data dummy event
const events = [
  { date: new Date(2026, 1, 2), title: 'Meeting', time: '10:00 - 11:00' },
  { date: new Date(2026, 2, 6), title: 'Developer Meetup', time: '10:00 - 11:00' },
  { date: new Date(2026, 3, 23), title: 'Developer Meetup', time: '10:00 - 11:00' },
  { date: new Date(2026, 4, 29), title: 'Friends Meet', time: '09:00 - 13:42' },
];

export function CalendarView() {
  return <CustomCalendar events={events} />;
}