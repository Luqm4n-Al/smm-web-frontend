'use client';

import {
  useEffect,
  useState,
} from 'react';

interface Props {
  activeUsers: number;

  inactiveUsers: number;
}

export default function DashboardUserDistribution({
  activeUsers,
  inactiveUsers,
}: Props) {
  /**
   * TOTAL USERS
   */
  const totalUsers =
    activeUsers +
    inactiveUsers;

  /**
   * ACTIVE %
   */
  const activePercentage =
    totalUsers > 0
      ? Math.round(
          (activeUsers /
            totalUsers) *
            100
        )
      : 0;

  /**
   * ANIMATION
   */
  const [
    animatedPercentage,
    setAnimatedPercentage,
  ] = useState(0);

  useEffect(() => {
    let start = 0;

    const duration = 1000;

    const increment =
      activePercentage /
      (duration / 16);

    const timer =
      setInterval(() => {
        start += increment;

        if (
          start >=
          activePercentage
        ) {
          setAnimatedPercentage(
            activePercentage
          );

          clearInterval(
            timer
          );
        } else {
          setAnimatedPercentage(
            Math.floor(start)
          );
        }
      }, 16);

    return () =>
      clearInterval(timer);
  }, [activePercentage]);

  return (
    <div className="rounded-[10px] border border-black/60 bg-white p-5 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            User Distribution
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Active and inactive users
          </p>
        </div>

        <div className="text-xs font-medium text-gray-500">
          {totalUsers.toLocaleString()}{' '}
          Users
        </div>
      </div>

      {/* CHART */}
      <div className="mt-7 flex justify-center">
        <div className="relative h-52 w-52">
          {/* DONUT */}
          <div
            className="flex h-full w-full items-center justify-center rounded-full transition-all duration-700"
            style={{
              background: `conic-gradient(
                #1D4ED8 0% ${animatedPercentage}%,
                #E5E7EB ${animatedPercentage}% 100%
              )`,
            }}
          >
            {/* CENTER */}
            <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-white">
              <h2 className="text-4xl font-bold text-blue-700">
                {
                  animatedPercentage
                }
                %
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Active
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* LEGEND */}
      <div className="mt-7 flex items-center justify-center gap-6">
        {/* ACTIVE */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-700" />

          <span className="text-sm text-gray-700">
            Active
          </span>
        </div>

        {/* INACTIVE */}
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