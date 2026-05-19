interface Props {
  activeUsers: number;

  inactiveUsers: number;
}

export default function DashboardUserDistribution({
  activeUsers,
  inactiveUsers,
}: Props) {
  const totalUsers =
    activeUsers + inactiveUsers;

  const activePercentage =
    totalUsers > 0
      ? Math.round(
          (activeUsers / totalUsers) * 100
        )
      : 0;

  return (
    <div className="rounded-[8px] border border-black bg-white p-5">
      {/* TITLE */}
      <h3 className="text-[18px] font-semibold text-gray-900">
        User Distribution
      </h3>

      {/* CHART */}
      <div className="mt-5 flex justify-center">
        <div className="relative h-48 w-48">
          <div
            className="flex h-full w-full items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(
                #1D4ED8 0% ${activePercentage}%,
                #E5E7EB ${activePercentage}% 100%
              )`,
            }}
          >
            <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-white">
              <h2 className="text-[42px] font-bold text-blue-700">
                {activePercentage}%
              </h2>

              <p className="text-[15px] text-gray-500">
                Active
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* LEGEND */}
      <div className="mt-5 flex items-center justify-center gap-5">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-700" />

          <span className="text-sm text-gray-700">
            Active
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-gray-300" />

          <span className="text-sm text-gray-700">
            Inactive
          </span>
        </div>
      </div>
    </div>
  );
}