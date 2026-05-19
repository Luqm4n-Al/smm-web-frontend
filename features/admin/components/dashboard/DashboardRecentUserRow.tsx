interface Props {
  user: any;
}

export default function DashboardRecentUserRow({
  user,
}: Props) {
  return (
    <div className="grid grid-cols-[1.5fr_2fr_120px] items-center border-t border-gray-100 px-6 py-5">
      {/* USERNAME */}
      <div className="text-sm font-medium text-gray-900">
        {user.username}
      </div>

      {/* EMAIL */}
      <div className="text-sm text-gray-500">
        {user.email}
      </div>

      {/* STATUS */}
      <div className="flex justify-center">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            user.status?.toLowerCase() ===
            'active'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-600'
          }`}
        >
          {user.status}
        </span>
      </div>
    </div>
  );
}