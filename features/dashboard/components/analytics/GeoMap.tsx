// features/dashboard/components/Analytics/GeoMap.tsx
'use client';

import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { ParentSize } from '@visx/responsive';
import { FiMapPin } from 'react-icons/fi';

interface HeatmapData {
  code: string;
  value: number;
}

interface GeoMapProps {
  data: HeatmapData[];
}

export function GeoMap({ data }: GeoMapProps) {
  const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';

  const getFillColor = (countryCode: string): string => {
    if (!countryCode || countryCode === '-99') return '#e5e7eb';

    const entry = data.find(
      d => d.code === countryCode
    );
    
    //Debug: uncomment untuk cek apakah code match
    console.log( 'Checking:', countryCode, '| Match:', entry);

    if (!entry) return '#e5e7eb';

    const value = entry.value;
    if (value > 5000) return '#1d4ed8';
    if (value > 1000) return '#3b82f6';
    if (value > 100) return '#60a5fa';
    return '#93c5fd';
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <FiMapPin className="h-5 w-5 text-gray-400" />
        <h2 className="text-lg font-medium text-gray-900">Persebaran Followers</h2>
        <span className="ml-auto text-xs text-gray-500">Berdasarkan lokasi</span>
      </div>
      <div className="h-80 w-full">
        <ParentSize>
          {({ width, height }) => (
            <ComposableMap projection="geoMercator" projectionConfig={{ scale: width > 600 ? 120 : 80, center: [20, 0] }} width={width} height={height} className="bg-gray-50 rounded-md">
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const countryCode: string = (geo.properties?.iso_a2 as string) ?? '-99';
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        className="stroke-white transition-colors duration-200 hover:stroke-blue-500 hover:stroke-2"
                        style={{
                          default: { fill: getFillColor(countryCode), outline: 'none' },
                          hover: { fill: '#2563eb', outline: 'none' },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          )}
        </ParentSize>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-end gap-3 text-xs">
        <div className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-[#1d4ed8]"></span><span>&gt;8k</span></div>
        <div className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-[#3b82f6]"></span><span>5k - 8k</span></div>
        <div className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-[#60a5fa]"></span><span>3k - 5k</span></div>
        <div className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-[#93c5fd]"></span><span>1k - 3k</span></div>
        <div className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm bg-[#e5e7eb]"></span><span>Data tidak tersedia</span></div>
      </div>
    </div>
  );
}