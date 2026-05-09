import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  variant?: 'icon' | 'full';
  size?: number;
  className?: string;
  href?: string;
  priority?: boolean;
}

export function Logo({
  variant = 'full',
  size = 28,
  className = '',
  href = '/',
  priority = false,
}: LogoProps) {
  const logoSrc = variant === 'icon' ? '/logo-icon.svg' : '/logo-full.svg';

  // Hitung lebar berdasarkan rasio (lebar asli / tinggi asli)
  const width = variant === 'icon' ? size : size * 3.5;

  return (
    <Link
      href={href}
      className={`inline-flex items-center ${className}`}
      style={{ height: `${size}px` }}
    >
      <Image
        src={logoSrc}
        alt="Social Vista"
        width={width}
        height={size}
        priority={priority}
        className="h-full! w-auto!"
      />
    </Link>
  );
}