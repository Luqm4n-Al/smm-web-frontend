interface User {
  id: string;

  username: string;

  email: string;

  role: string;

  isActive: boolean;
}

interface Props {
  user: User;
}

export default function DashboardRecentUserRow({
  user,
}: Props) {
  /**
   * Avatar initials
   */
  const initials =
    user.username
      ?.slice(0, 2)
      .toUpperCase() || 'US';

  return (
    <div className="grid grid-cols-[2fr_2fr_140px] items-center px-6 py-4 transition hover:bg-gray-50">
      {/* USER */}
      <div className="flex items-center gap-3">
        {/* AVATAR */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
          {initials}
        </div>

        {/* USERNAME */}
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {user.username}
          </p>
        </div>
      </div>

      {/* EMAIL */}
      <div>
        <p className="truncate text-sm text-gray-500">
          {user.email}
        </p>
      </div>

      {/* STATUS */}
      <div className="flex justify-center">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            user.isActive
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-600'
          }`}
        >
          {user.isActive
            ? 'Active'
            : 'Inactive'}
        </span>
      </div>
    </div>
  );
}