'use client';

import { useState } from 'react';
import { useGetContentSchedules } from '../../graphql/content-schedules.query';
import { CustomCalendar } from './CustomCalendar';
import { PlanningList } from './PlanningList';
import { DataErrorFallback } from '../DataErrorFallback';

export function ScheduleView() {
  const { data, loading, error, refetch } = useGetContentSchedules();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  if (loading) return <div className="flex justify-center py-10 text-gray-500">Memuat jadwal...</div>;
  if (error) return <DataErrorFallback error={error} title="Gagal Memuat Jadwal" onRetry={refetch} />;

  const schedules = data?.contentSchedules || [];

  // Konversi ke event kalender
  const events = schedules
    .filter(s => s.scheduledUpload)
    .map(s => ({
      date: new Date(s.scheduledUpload!),
      title: s.title,
      time: new Date(s.scheduledUpload!).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Scheduling</h1>
        <p className="text-gray-600">Kelola jadwal konten dan rencana publikasi.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CustomCalendar
            events={events}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>
        <div className="lg:col-span-1">
          <PlanningList
            schedules={schedules}
            onRefresh={async ()=> {await refetch(); }}
          />
        </div>
      </div>
    </div>
  );
}