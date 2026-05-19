import { usePagination } from '../../hooks/useUserManagementPagination';

interface Props {
  page: number;

  totalPages: number;

  totalUsers: number;

  usersPerPage: number;

  setUsersPerPage: React.Dispatch<
    React.SetStateAction<number>
  >;

  setPage: React.Dispatch<
    React.SetStateAction<number>
  >;
}

export default function UserManagementPagination({
  page,
  totalPages,
  totalUsers,
  usersPerPage,
  setUsersPerPage,
  setPage,
}: Props) {
  const pages = usePagination(
    page,
    totalPages
  );

  return (
    <div className="flex flex-col gap-4 rounded-[10px] border border-black-100 bg-white px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
      {/* LEFT */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">
          Rows per page
        </span>

        <select
          value={usersPerPage}
          onChange={(e) => {
            setUsersPerPage(
              Number(
                e.target.value
              )
            );

            setPage(1);
          }}
          className="h-9 rounded-[8px] border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none"
        >
          <option value={5}>
            5
          </option>

          <option value={10}>
            10
          </option>

          <option value={20}>
            20
          </option>

          <option value={50}>
            50
          </option>
        </select>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        {/* PREV */}
        <button
          disabled={page === 1}
          onClick={() =>
            setPage((prev) =>
              Math.max(prev - 1, 1)
            )
          }
          className="flex h-9 items-center rounded-[8px] border border-gray-200 px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prev
        </button>

        {/* PAGES */}
        {pages.map(
          (item, index) =>
            item === '...' ? (
              <span
                key={index}
                className="px-1 text-sm text-gray-500"
              >
                ...
              </span>
            ) : (
              <button
                key={index}
                onClick={() =>
                  setPage(
                    item as number
                  )
                }
                className={`flex h-9 w-9 items-center justify-center rounded-[8px] border text-sm font-medium transition ${
                  page === item
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item}
              </button>
            )
        )}

        {/* NEXT */}
        <button
          disabled={
            page === totalPages
          }
          onClick={() =>
            setPage((prev) =>
              Math.min(
                prev + 1,
                totalPages
              )
            )
          }
          className="flex h-9 items-center rounded-[8px] border border-gray-200 px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}