'use client';

import { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { ParentSize } from '@visx/responsive';
import { FiMapPin, FiZoomIn, FiZoomOut } from 'react-icons/fi';
import * as isoCountries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

// Registrasi locale bahasa Inggris (sesuai nama di GeoJSON)
isoCountries.registerLocale(enLocale);

interface HeatmapData {
  code: string;
  value: number;
}

interface GeoMapProps {
  data: HeatmapData[];
}

// Mapping HANYA untuk kode non-standar dari backend
// Jika backend sudah pakai ISO A2 standar, tidak perlu entry di sini
const NON_STANDARD_CODES: Record<string, string> = {
  EN: 'GB', // Backend pakai EN untuk United Kingdom
  HI: 'IN', // Backend pakai HI untuk India — konfirmasi ke tim backend
};

const COLOR_SCALE = [
  { min: 1000, color: '#1d4ed8' },
  { min: 500,  color: '#2563eb' },
  { min: 200,  color: '#3b82f6' },
  { min: 1,    color: '#60a5fa' },
  { min: 0,    color: '#e5e7eb' },
];

function getColor(value: number): string {
  const scale = COLOR_SCALE.find(s => value >= s.min);
  return scale ? scale.color : '#e5e7eb';
}

export function GeoMap({ data }: GeoMapProps) {
  const [zoom, setZoom] = useState(1);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    countryName: string;
    value: number | null;
  }>({ visible: false, x: 0, y: 0, countryName: '', value: null });
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);

  const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';

  // Konversi data backend → Map dengan key ISO A2 standar
  // Proses ini otomatis, tidak perlu tambah mapping manual untuk kode standar
  const isoValueMap = useMemo(() => {
    const map = new Map<string, number>();

    data.forEach(({ code, value }) => {
      // Cek apakah kode non-standar, jika ya gunakan mapping override
      const resolvedCode = NON_STANDARD_CODES[code] ?? code;
      map.set(resolvedCode.toUpperCase(), value);
    });

    return map;
  }, [data]);

  const ISO_NAME_OVERRIDE: Record<string, string> = {
    TR: 'Turkey',
  }

  const geoValueMap = useMemo(() => {
    // Buat lookup: nama negara (dari GeoJSON) → value
    // Menggunakan i18n-iso-countries untuk konversi nama → ISO A2 → value
    const map = new Map<string, number>();

    isoValueMap.forEach((value, isoA2) => {
      
      // Dapatkan nama negara dalam bahasa Inggris dari kode ISO A2
      const countryName = ISO_NAME_OVERRIDE[isoA2] ?? isoCountries.getName(isoA2, 'en');
      if (countryName) {
        map.set(countryName, value);
      }
    });

    return map;
  }, [isoValueMap]);

  const getRelativePosition = (evt: React.MouseEvent, containerRef: HTMLDivElement | null) => {
    if (!containerRef) return { x: evt.clientX, y: evt.clientY };
    const rect = containerRef.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
  };

  const handleZoomIn  = () => setZoom(prev => Math.min(prev * 1.5, 8));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.5, 1));

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <FiMapPin className="h-5 w-5 text-gray-400" />
        <h2 className="text-lg font-medium text-gray-900">Persebaran Followers</h2>
        <span className="ml-auto text-xs text-gray-500">Berdasarkan lokasi</span>
      </div>

      <div className="relative h-80 w-full" ref={setMapContainer}>
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          <button
            onClick={handleZoomIn}
            className="rounded bg-white p-1 shadow hover:bg-gray-100"
            title="Perbesar"
          >
            <FiZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="rounded bg-white p-1 shadow hover:bg-gray-100"
            title="Perkecil"
          >
            <FiZoomOut className="h-4 w-4" />
          </button>
        </div>

        {tooltip.visible && (
          <div
            className="pointer-events-none absolute z-20 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg"
            style={{ left: tooltip.x + 12, top: tooltip.y - 12, maxWidth: 180 }}
          >
            <p className="font-semibold">{tooltip.countryName}</p>
            <p className="mt-0.5 text-gray-300">
              {tooltip.value !== null
                ? `${tooltip.value.toLocaleString('id-ID')} followers`
                : 'Data tidak tersedia'}
            </p>
          </div>
        )}

        <ParentSize>
          {({ width, height }) => (
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 120 }}
              width={width || 800}
              height={height || 320}
              className="bg-gray-50 rounded-md"
            >
              <ZoomableGroup zoom={zoom} maxZoom={8} minZoom={1}>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const countryName: string = (geo.properties?.name as string) ?? 'Unknown';

                      // Lookup value berdasarkan nama negara
                      // Tidak perlu mapping manual — i18n-iso-countries handle ini
                      const value = geoValueMap.get(countryName) ?? null;
                      const fillColor = value !== null ? getColor(value) : '#e5e7eb';

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          style={{
                            default: {
                              fill: fillColor,
                              stroke: '#d1d5db',
                              strokeWidth: 0.5,
                              outline: 'none',
                            },
                            hover: {
                              fill: '#0077B6',
                              stroke: '#9ca3af',
                              strokeWidth: 1,
                              outline: 'none',
                            },
                            pressed: {
                              fill: '#005f8e',
                              outline: 'none',
                            },
                          }}
                          onMouseEnter={(evt) => {
                            const pos = getRelativePosition(evt, mapContainer);
                            setTooltip({ visible: true, x: pos.x, y: pos.y, countryName, value });
                          }}
                          onMouseMove={(evt) => {
                            const pos = getRelativePosition(evt, mapContainer);
                            setTooltip(prev => ({ ...prev, x: pos.x, y: pos.y }));
                          }}
                          onMouseLeave={() =>
                            setTooltip(prev => ({ ...prev, visible: false }))
                          }
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          )}
        </ParentSize>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-end gap-3 text-xs">
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-[#1d4ed8]"></span><span>1000+</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-[#2563eb]"></span><span>500 - 999</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-[#3b82f6]"></span><span>200 - 499</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-[#60a5fa]"></span><span>1 - 199</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-[#e5e7eb]"></span><span>Tidak ada data</span>
        </div>
      </div>
    </div>
  );
}