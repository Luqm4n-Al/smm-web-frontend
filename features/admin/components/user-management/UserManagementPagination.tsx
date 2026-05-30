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

  /**
   * START - END DATA
   */
  const startData =
    totalUsers === 0
      ? 0
      : (page - 1) *
          usersPerPage +
        1;

  const endData = Math.min(
    page * usersPerPage,
    totalUsers
  );

  return (
    <div className="flex flex-col gap-4 rounded-[10px] border border-black-100 bg-white px-6 py-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      {/* LEFT */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">

        {/* ROWS */}
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
            className="h-10 rounded-[10px] border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-500 focus:bg-white"
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
          className="flex h-10 items-center rounded-[10px] border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prev
        </button>

        {/* PAGES */}
        <div className="flex items-center gap-2">
          {pages.map(
            (item, index) =>
              item === '...' ? (
                <span
                  key={index}
                  className="px-1 text-sm text-gray-400"
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
                  className={`flex h-10 w-10 items-center justify-center rounded-[10px] border text-sm font-semibold transition-all duration-200 ${
                    page === item
                      ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  {item}
                </button>
              )
          )}
        </div>

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
          className="flex h-10 items-center rounded-[10px] border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}