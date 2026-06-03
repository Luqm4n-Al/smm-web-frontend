'use client';

import { useEffect, useState } from 'react';

import {
  ChevronDown,
  Clock3,
  Filter,
  Search,
} from 'lucide-react';

interface Props {
  search: string;

  setSearch: (
    value: string
  ) => void;

  status:
    | 'All'
    | 'Active'
    | 'Inactive';

  setStatus: (
    value:
      | 'All'
      | 'Active'
      | 'Inactive'
  ) => void;

  startDate: string;

  endDate: string;

  onChangeStartDate?: (
    value: string
  ) => void;

  onChangeEndDate?: (
    value: string
  ) => void;

  setPage: (
    page: number
  ) => void;
}

export default function UserManagementFilters(
  props: Props
) {
  const {
    search,
    setSearch,

    status,
    setStatus,

    startDate,
    endDate,

    onChangeStartDate =
      () => {},

    onChangeEndDate =
      () => {},

    setPage,
  } = props;

  // FILTER POPUP
  const [open, setOpen] =
    useState(false);

  // APPLIED LOGIN RANGE
  const [loginRange, setLoginRange] =
    useState('Last 30 Days');

  // TEMP FILTER
  const [tempStatus, setTempStatus] =
    useState(status);

  const [
    tempLoginRange,
    setTempLoginRange,
  ] = useState(loginRange);

  // DROPDOWN
  const [
    openFrequency,
    setOpenFrequency,
  ] = useState(false);

  // SYNC DRAFT
  useEffect(() => {
    setTempStatus(status);
  }, [status]);

  // TOGGLE FILTER
  
  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  // APPLY FILTER
  const handleApplyFilter =
    () => {
      setStatus(tempStatus);

      setLoginRange(
        tempLoginRange
      );

      const now =
        new Date();

      const end =
        new Date();

      const start =
        new Date();

      if (
        tempLoginRange ===
        'Last 24 Hours'
      ) {
        start.setDate(
          now.getDate() - 1
        );
      } else if (
        tempLoginRange ===
        'Last 7 Days'
      ) {
        start.setDate(
          now.getDate() - 7
        );
      } else if (
        tempLoginRange ===
        'Last 30 Days'
      ) {
        start.setDate(
          now.getDate() - 30
        );
      } else if (
        tempLoginRange ===
        'Last 90 Days'
      ) {
        start.setDate(
          now.getDate() - 90
        );
      }

      const formattedStartDate =
        start
          .toISOString()
          .split('T')[0];

      const formattedEndDate =
        end
          .toISOString()
          .split('T')[0];

      onChangeStartDate(
        formattedStartDate
      );

      onChangeEndDate(
        formattedEndDate
      );

      setPage(1);

      setOpen(false);
    };

  // RESET
  const handleReset =
    () => {
      setSearch('');

      setStatus('All');

      setTempStatus('All');

      setLoginRange(
        'Last 30 Days'
      );

      setTempLoginRange(
        'Last 30 Days'
      );

      onChangeStartDate('');

      onChangeEndDate('');

      setPage(1);

      setOpenFrequency(false);

      setOpen(false);
    };

  return (
    <div className="flex items-center gap-3">
      {/* SEARCH */}
      <div className="relative w-[260px]">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(
              e.target.value
            );

            setPage(1);
          }}
          placeholder="Search users..."
          className="
            h-10
            w-full
            rounded-[10px]
            border
            border-black/60
            bg-white
            pl-10
            pr-4
            text-sm
            text-gray-700
            outline-none
            transition-all
            focus:border-blue-500
          "
        />
      </div>

      {/* FILTER */}
      <div className="relative">
        <button
          onClick={toggleOpen}
          className="
            flex
            h-10
            items-center
            gap-2
            rounded-[10px]
            border
            border-black/60
            bg-white
            px-4
            text-sm
            font-medium
            text-gray-700
            transition-all
            hover:bg-gray-50
          "
        >
          <Filter size={16} />
          Filters
        </button>

        {open && (
          <div
            className="
              absolute
              right-0
              top-12
              z-50
              w-[280px]
              rounded-[10px]
              border
              border-black/10
              bg-white
              p-4
              shadow-lg
            "
          >
            {/* HEADER */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Filters
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Compact menu-based
                selection
              </p>
            </div>

            {/* STATUS */}
            <div className="mb-6">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Status
              </p>

              <div className="grid grid-cols-3 gap-2">
                {[
                  'All',
                  'Active',
                  'Inactive',
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setTempStatus(
                        item as
                          | 'All'
                          | 'Active'
                          | 'Inactive'
                      )
                    }
                    className={`rounded-xl border px-3 py-2 text-sm font-medium transition-all ${
                      tempStatus === item
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* LOGIN FREQUENCY */}
            <div className="mb-6">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Login Frequency
              </p>

              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setOpenFrequency(
                      (prev) =>
                        !prev
                    )
                  }
                  className="
                    flex
                    h-11
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-blue-500
                    bg-white
                    px-4
                    text-sm
                    font-medium
                    text-gray-800
                  "
                >
                  <div className="flex items-center gap-2">
                    <Clock3 size={16} />
                    {tempLoginRange}
                  </div>

                  <ChevronDown
                    size={16}
                  />
                </button>

                {openFrequency && (
                  <div
                    className="
                      absolute
                      left-0
                      top-12
                      z-50
                      w-full
                      overflow-hidden
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      shadow-xl
                    "
                  >
                    {[
                      'Last 24 Hours',
                      'Last 7 Days',
                      'Last 30 Days',
                      'Last 90 Days',
                    ].map(
                      (
                        item
                      ) => (
                        <button
                          key={
                            item
                          }
                          type="button"
                          onClick={() => {
                            setTempLoginRange(
                              item
                            );

                            setOpenFrequency(
                              false
                            );
                          }}
                          className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-all ${
                            tempLoginRange ===
                            item
                              ? 'bg-blue-50 text-blue-700'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          {item}

                          {tempLoginRange ===
                            item && (
                            <span>
                              ✓
                            </span>
                          )}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <button
                onClick={
                  handleReset
                }
                className="
                  text-sm
                  font-medium
                  text-gray-500
                  transition
                  hover:text-black
                "
              >
                Reset Filters
              </button>

              <button
                onClick={
                  handleApplyFilter
                }
                className="
                  rounded-xl
                  bg-black
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-white
                "
              >
                Apply Filter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}