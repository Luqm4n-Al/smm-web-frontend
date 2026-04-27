// src/features/auth/components/AuthPreview.tsx
interface AuthPreviewProps {
  variant?: 'login' | 'register';
}

export function AuthPreview({ variant = 'login' }: AuthPreviewProps) {
  const features = variant === 'register' 
    ? [
        'Pantau pertumbuhan followers',
        'Analisis sentimen otomatis',
        'Jadwalkan konten mingguan',
        'Rekomendasi hashtag cerdas',
      ]
    : [
        'Dapatkan insight mendalam',
        'Optimalkan strategi konten',
        'Satu dashboard untuk semua',
      ];

  return (
    <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:items-center lg:justify-center lg:bg-linear-to-br lg:from-blue-50 lg:to-blue-100 lg:p-12">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {variant === 'register' ? 'Mulai Perjalanan Anda' : 'Pantau Performa Media Sosial Anda'}
        </h2>
        <p className="mt-4 text-gray-600">
          {variant === 'register' 
            ? 'Bergabunglah dengan ribuan kreator yang sudah menggunakan platform kami untuk mengembangkan bisnis.'
            : 'Dapatkan insight mendalam, jadwalkan konten, dan optimalkan strategi sosial media Anda dalam satu dashboard.'
          }
        </p>
        {/* Fitur List */}
        <ul className="mt-8 space-y-3 text-left">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-3 text-sm text-gray-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs">✓</span>
              {feature}
            </li>
          ))}
        </ul>
        {/* Placeholder preview */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-sm font-medium text-gray-700">Statistik Akun</span>
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">+12.5%</span>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Followers</span>
              <span className="font-medium">12,453</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div className="h-2 w-3/4 rounded-full bg-blue-500"></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Engagement</span>
              <span className="font-medium">4.3%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div className="h-2 w-2/3 rounded-full bg-green-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}