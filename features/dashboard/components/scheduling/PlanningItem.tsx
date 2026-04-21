// src/features/dashboard/components/Scheduling/PlanningItem.tsx
interface PlanningItemProps {
  name: string;
  date: string;
  status: 'draft' | 'scheduled' | 'published';
}

const statusStyles = {
  draft: 'bg-gray-100 text-gray-700',
  scheduled: 'bg-yellow-100 text-yellow-700',
  published: 'bg-green-100 text-green-700',
};

const statusLabels = {
  draft: 'Draft',
  scheduled: 'Terjadwal',
  published: 'Dipublikasi',
};

export function PlanningItem({ name, date, status }: PlanningItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3">
      <div>
        <p className="font-medium text-gray-900">{name}</p>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyles[status]}`}>
        {statusLabels[status]}
      </span>
    </div>
  );
}