'use client';

const data = [
  120,
  210,
  180,
  280,
  240,
  320,
  410,
];

export default function DashboardChart() {
  const maxValue = Math.max(...data);

  return (
    <div className="rounded-[12px] border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            User Growth
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Weekly platform growth
          </p>
        </div>
      </div>

      <div className="mt-8 flex h-64 items-end gap-4">
        {data.map((value, index) => (
          <div
            key={index}
            className="flex flex-1 flex-col items-center"
          >
            <div
              className="w-full rounded-t-lg bg-blue-600"
              style={{
                height: `${
                  (value / maxValue) * 220
                }px`,
              }}
            />

            <span className="mt-3 text-xs text-gray-500">
              W{index + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}