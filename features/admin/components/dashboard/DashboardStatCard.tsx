import {
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

interface Props {
  title: string;

  value: string;

  growth: string;

  increase?: boolean;

  icon: React.ReactNode;
}

export default function DashboardStatCard({
  title,
  value,
  growth,
  increase = true,
  icon,
}: Props) {
  return (
    <div className="rounded-[8px] border border-black bg-white px-5 py-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium text-gray-500">
            {title}
          </p>

          <h2 className="mt-2 text-[44px] font-bold leading-none text-gray-900">
            {value}
          </h2>

          <div className="mt-3 flex items-center gap-1">
            {increase ? (
              <TrendingUp
                size={15}
                className="text-green-600"
              />
            ) : (
              <TrendingDown
                size={15}
                className="text-red-500"
              />
            )}

            <p
              className={`text-[13px] font-medium ${
                increase
                  ? 'text-green-600'
                  : 'text-red-500'
              }`}
            >
              {growth} dari bulan lalu
            </p>
          </div>
        </div>

        <div>{icon}</div>
      </div>
    </div>
  );
}