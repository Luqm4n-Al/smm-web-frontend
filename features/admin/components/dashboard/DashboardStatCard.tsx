'use client';

import { useEffect, useState } from 'react';

import {
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

interface Props {
  title: string;

  value: number;

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
  /**
   * Animated Counter
   */
  const [count, setCount] =
    useState(0);

  useEffect(() => {
    let start = 0;

    const duration = 800;

    const increment =
      value / (duration / 16);

    const timer =
      setInterval(() => {
        start += increment;

        if (start >= value) {
          setCount(value);

          clearInterval(
            timer
          );
        } else {
          setCount(
            Math.floor(start)
          );
        }
      }, 16);

    return () =>
      clearInterval(timer);
  }, [value]);

  return (
    <div className="rounded-[10px] border border-black/60 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        {/* LEFT */}
        <div>
          {/* TITLE */}
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          {/* VALUE */}
          <h2 className="mt-3 text-4xl font-bold leading-none text-gray-900">
            {count}
          </h2>

          {/* GROWTH */}
          <div className="mt-4 flex items-center gap-1">
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
              className={`text-sm font-medium ${
                increase
                  ? 'text-green-600'
                  : 'text-red-500'
              }`}
            >
              {growth} of all users
            </p>
          </div>
        </div>

        {/* ICON */}
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50">
          {icon}
        </div>
      </div>
    </div>
  );
}