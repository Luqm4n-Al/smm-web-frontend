'use client';

import { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { ParentSize } from '@visx/responsive';
import { FiMapPin, FiZoomIn, FiZoomOut } from 'react-icons/fi';

interface HeatmapData {
  code: string;
  value: number;
}

interface GeoMapProps {
  data: HeatmapData[];
}

// State untuk tooltip
interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  countryName: string;
  value: number | null;
}

export function GeoMap({ data }: GeoMapProps) {
  const [zoom, setZoom] = useState(1);

  // Tooltip state
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    countryName: '',
    value: null,
  });

  const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';

  const getFillColor = (countryCode: string): string => {
    if (!countryCode || countryCode === '-99') return '#e5e7eb';
    const entry = data.find((d) => d.code === countryCode);
    if (!entry) return '#e5e7eb';
    const value = entry.value;
    if (value >= 1000) return '#1d4ed8';
    if (value >= 500)  return '#2563eb';
    if (value >= 200)  return '#60a5fa';
    return '#93c5fd';
  };

  /**
   * Ambil posisi mouse relatif terhadap container peta
   * Menggunakan currentTarget (container div) bukan window,
   * agar posisi tooltip tidak meleset saat scroll/zoom halaman
   */
  const getRelativePosition = (
    evt: React.MouseEvent,
    containerRef: HTMLDivElement | null
  ) => {
    if (!containerRef) return { x: evt.clientX, y: evt.clientY };
    const rect = containerRef.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  };

  // Ref untuk container peta (dipakai kalkulasi posisi tooltip)
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);

  const handleZoomIn  = () => setZoom((prev) => Math.min(prev * 1.5, 8));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev / 1.5, 1));

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <FiMapPin className="h-5 w-5 text-gray-400" />
        <h2 className="text-lg font-medium text-gray-900">Persebaran Followers</h2>
        <span className="ml-auto text-xs text-gray-500">Berdasarkan lokasi</span>
      </div>

      {/*
       * Container peta: pakai `ref` callback agar bisa kalkulasi
       * posisi tooltip relatif terhadap container ini
       */}
      <div
        className="relative h-80 w-full"
        ref={setMapContainer}
      >
        {/* Zoom buttons */}
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          <button onClick={handleZoomIn} className="rounded bg-white p-1 shadow hover:bg-gray-100" title="Perbesar">
            <FiZoomIn className="h-4 w-4" />
          </button>
          <button onClick={handleZoomOut} className="rounded bg-white p-1 shadow hover:bg-gray-100" title="Perkecil">
            <FiZoomOut className="h-4 w-4" />
          </button>
        </div>

        {/* Tooltip overlay */}
        {tooltip.visible && (
          <div
            className="pointer-events-none absolute z-20 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg"
            style={{
              // Offset +12 agar tooltip tidak tepat di bawah kursor
              left: tooltip.x + 12,
              top: tooltip.y - 12,
              // Cegah tooltip keluar dari sisi kanan container
              maxWidth: 180,
              whiteSpace: 'nowrap',
            }}
          >
            {/* Nama negara */}
            <p className="font-semibold">{tooltip.countryName}</p>

            {/* Data followers atau fallback */}
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
              <ZoomableGroup
                zoom={zoom}
                maxZoom={8}
                minZoom={1}
                translateExtent={[
                  [-100, -100],
                  [(width || 800) + 100, (height || 320) + 100],
                ]}
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const countryCode: string =
                        (geo.properties?.iso_a2 as string) ?? '-99';

                      // Ambil nama negara dari properti geoJSON
                      const countryName: string =
                        (geo.properties?.name as string) ?? 'Unknown';

                      // Cari data followers untuk negara ini
                      const entry = data.find((d) => d.code === countryCode);

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          className="stroke-white transition-colors duration-200"
                          style={{
                            default: { fill: getFillColor(countryCode), outline: 'none' },
                            hover:   { fill: '#0077B6', outline: 'none' }, 
                          }}

                          // Tampilkan tooltip saat mouse masuk
                          onMouseEnter={(evt) => {
                            const pos = getRelativePosition(evt, mapContainer);
                            setTooltip({
                              visible: true,
                              x: pos.x,
                              y: pos.y,
                              countryName,
                              value: entry?.value ?? null,
                            });
                          }}

                          // Update posisi tooltip saat mouse bergerak
                          onMouseMove={(evt) => {
                            const pos = getRelativePosition(evt, mapContainer);
                            setTooltip((prev) => ({
                              ...prev,
                              x: pos.x,
                              y: pos.y,
                            }));
                          }}

                          // Sembunyikan tooltip saat mouse keluar
                          onMouseLeave={() => {
                            setTooltip((prev) => ({ ...prev, visible: false }));
                          }}
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

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-end gap-3 text-xs">
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-[#1d4ed8]"></span><span>1000+</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-[#2563eb]"></span><span>500 - 999</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-[#60a5fa]"></span><span>200 - 499</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-[#93c5fd]"></span><span>0 - 199</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-[#e5e7eb]"></span><span>Data tidak tersedia</span>
        </div>
      </div>
    </div>
  );
}