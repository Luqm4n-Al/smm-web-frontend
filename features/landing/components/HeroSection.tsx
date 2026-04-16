'use client'
import Link from "next/link";

export function HeroSection() {
  const handleScrollToAnalytic = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('analytic-featuure');
    if (element) {
      element.scrollIntoView({behavior: 'smooth'})
    }
  }

  return (
    <section className="bg-linear-to-b from-blue-50 to-white px-4 py-20 md:py-28">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          Welcome to{' '}
          <span className="text-blue-600">Social Vista</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Solusi bagi Anda yang membutuhkan perencanaan, publikasi, dan peningkatan performa konten media sosial.
        </p>
        <div className="mt-10">
          <Link
            href="#analytic-feature"
            scroll={false}
            onClick={handleScrollToAnalytic}
            className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Lihat Fitur
          </Link>
        </div>
      </div>
    </section>
  );
}