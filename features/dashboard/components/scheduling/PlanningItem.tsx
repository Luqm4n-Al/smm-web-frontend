// src/features/dashboard/components/Scheduling/PlanningItem.tsx
interface PlanningItemProps {
  name: string;
  date: string;
}

export function PlanningItem({ name, date }: PlanningItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
      <div>
        <p className="font-medium text-gray-900">{name}</p>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
    </div>
  );
}