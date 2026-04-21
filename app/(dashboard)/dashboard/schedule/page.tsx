
import { CalendarView } from "@/features/dashboard/components/scheduling/CalenderView";
import { PlanningList } from "@/features/dashboard/components/scheduling/PlanningList";

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Scheduling</h1>
        <p className="text-gray-600">Kelola jadwal konten dan rencana publikasi.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Kalender */}
        <div className="lg:col-span-2">
          <CalendarView/>
        </div>

        {/* List Planning */}
        <div className="lg:col-span-1">
          <PlanningList/>
        </div>
      </div>
    </div>
  );
}