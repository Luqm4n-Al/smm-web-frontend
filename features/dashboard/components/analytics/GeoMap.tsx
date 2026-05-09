'use client';

// Import React hooks untuk state management dan optimasi perhitungan data
import { useState, useMemo } from 'react';

// Import komponen peta dari react-simple-maps
// ComposableMap      -> container utama map
// Geographies        -> pembungkus kumpulan negara
// Geography          -> setiap negara pada map
// ZoomableGroup      -> memungkinkan fitur zoom
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

// ParentSize digunakan agar map responsive mengikuti ukuran container
import { ParentSize } from '@visx/responsive';

// Import icon dari react-icons
import { FiMapPin, FiZoomIn, FiZoomOut } from 'react-icons/fi';

// Library untuk konversi kode negara ISO menjadi nama negara
import * as isoCountries from 'i18n-iso-countries';

// Locale bahasa Inggris agar nama negara sesuai dengan GeoJSON map
import enLocale from 'i18n-iso-countries/langs/en.json';

// Registrasi locale bahasa Inggris
// Ini diperlukan agar fungsi getName() bisa membaca nama negara dalam bahasa Inggris
isoCountries.registerLocale(enLocale);


// Interface data heatmap
// code  -> kode negara (contoh: ID, US, JP)
// value -> jumlah followers dari negara tersebut
interface HeatmapData {
  code: string;
  value: number;
}

// Props component GeoMap
interface GeoMapProps {
  data: HeatmapData[];
}


// Mapping untuk kode negara yang tidak standar dari backend
// Misalnya backend mengirim "EN" padahal standar ISO untuk UK adalah "GB"
const NON_STANDARD_CODES: Record<string, string> = {
  EN: 'GB',
  HI: 'IN',
};


// Skala warna berdasarkan jumlah followers
// Semakin besar value maka warna semakin gelap
const COLOR_SCALE = [
  { min: 1000, color: '#1d4ed8' },
  { min: 500,  color: '#2563eb' },
  { min: 200,  color: '#3b82f6' },
  { min: 1,    color: '#60a5fa' },
  { min: 0,    color: '#e5e7eb' },
];


// Fungsi untuk menentukan warna berdasarkan value
function getColor(value: number): string {

  // Cari warna pertama yang memenuhi syarat minimum value
  const scale = COLOR_SCALE.find(s => value >= s.min);

  // Jika ditemukan gunakan warna tersebut
  // Jika tidak gunakan warna default abu-abu
  return scale ? scale.color : '#e5e7eb';
}


// Component utama GeoMap
export function GeoMap({ data }: GeoMapProps) {

  // State zoom map
  // Default zoom = 1 (normal)
  const [zoom, setZoom] = useState(1);

  // State tooltip
  // Menyimpan posisi tooltip dan data negara yang sedang di-hover
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    countryName: string;
    value: number | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    countryName: '',
    value: null
  });

  // Menyimpan reference container map
  // Digunakan untuk menghitung posisi tooltip relatif terhadap container
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);


  // URL GeoJSON world map
  // Data negara diambil dari world-atlas CDN
  const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';


  // ============================================
  // Konversi data backend menjadi Map ISO
  // ============================================
  // useMemo digunakan agar proses tidak dihitung ulang
  // kecuali data berubah
  const isoValueMap = useMemo(() => {

    // Membuat object Map
    // format:
    // key   -> kode negara ISO
    // value -> jumlah followers
    const map = new Map<string, number>();

    data.forEach(({ code, value }) => {

      // Jika kode non-standar ditemukan
      // gunakan mapping override
      const resolvedCode = NON_STANDARD_CODES[code] ?? code;

      // Simpan ke map dalam format uppercase
      map.set(resolvedCode.toUpperCase(), value);
    });

    return map;
  }, [data]);


  // Override nama negara tertentu
  // Digunakan jika nama negara di GeoJSON berbeda
  // dengan hasil dari i18n-iso-countries
  const ISO_NAME_OVERRIDE: Record<string, string> = {
    TR: 'Turkey',
  }


  // Konversi ISO -> Nama Negara -> Value
  const geoValueMap = useMemo(() => {

    // Membuat map baru
    const map = new Map<string, number>();

    // Loop semua data ISO
    isoValueMap.forEach((value, isoA2) => {

      // Ambil nama negara berdasarkan kode ISO
      const countryName =
        ISO_NAME_OVERRIDE[isoA2]
        ?? isoCountries.getName(isoA2, 'en');

      // Jika nama negara ditemukan
      // simpan ke map
      if (countryName) {
        map.set(countryName, value);
      }
    });

    return map;
  }, [isoValueMap]);


  // Menghitung posisi tooltip relatif container
  const getRelativePosition = (
    evt: React.MouseEvent,
    containerRef: HTMLDivElement | null
  ) => {

    // Jika container tidak ada
    // gunakan posisi asli mouse
    if (!containerRef) {
      return {
        x: evt.clientX,
        y: evt.clientY
      };
    }

    // Ambil posisi container
    const rect = containerRef.getBoundingClientRect();

    // Hitung posisi mouse relatif terhadap container
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  };


  // Fungsi zoom in
  // Maksimal zoom = 8
  const handleZoomIn = () =>
    setZoom(prev => Math.min(prev * 1.5, 8));

  // Fungsi zoom out
  // Minimal zoom = 1
  const handleZoomOut = () =>
    setZoom(prev => Math.max(prev / 1.5, 1));


  return (

    // Container utama card
    <div className="rounded-lg border bg-white p-6 shadow-sm">

      {/* Header section */}
      <div className="mb-4 flex items-center gap-2">

        {/* Icon lokasi */}
        <FiMapPin className="h-5 w-5 text-gray-400" />

        {/* Judul */}
        <h2 className="text-lg font-medium text-gray-900">
          Persebaran Followers
        </h2>

        {/* Subtitle */}
        <span className="ml-auto text-xs text-gray-500">
          Berdasarkan lokasi
        </span>
      </div>


      {/* Container map */}
      <div
        className="relative h-80 w-full"
        ref={setMapContainer}
      >

        {/* Tombol zoom */}
        <div className="absolute top-2 right-2 z-10 flex gap-1">

          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            className="rounded bg-white p-1 shadow hover:bg-gray-100"
            title="Perbesar"
          >
            <FiZoomIn className="h-4 w-4" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            className="rounded bg-white p-1 shadow hover:bg-gray-100"
            title="Perkecil"
          >
            <FiZoomOut className="h-4 w-4" />
          </button>
        </div>


        {/* Tooltip */}
        {tooltip.visible && (
          <div
            className="pointer-events-none absolute z-20 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg"
            style={{
              left: tooltip.x + 12,
              top: tooltip.y - 12,
              maxWidth: 180
            }}
          >

            {/* Nama negara */}
            <p className="font-semibold">
              {tooltip.countryName}
            </p>

            {/* Jumlah followers */}
            <p className="mt-0.5 text-gray-300">
              {tooltip.value !== null
                ? `${tooltip.value.toLocaleString('id-ID')} followers`
                : 'Data tidak tersedia'}
            </p>
          </div>
        )}


        {/* ParentSize membuat map responsive */}
        <ParentSize>
          {({ width, height }) => (

            // Component map utama
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 120 }}
              width={width || 800}
              height={height || 320}
              className="bg-gray-50 rounded-md"
            >

              {/* Group yang support zoom */}
              <ZoomableGroup
                zoom={zoom}
                maxZoom={8}
                minZoom={1}
              >

                {/* Load semua negara dari GeoJSON */}
                <Geographies geography={geoUrl}>

                  {({ geographies }) =>

                    // Render setiap negara
                    geographies.map((geo) => {

                      // Ambil nama negara dari GeoJSON
                      const countryName: string =
                        (geo.properties?.name as string)
                        ?? 'Unknown';

                      // Cari value followers berdasarkan nama negara
                      const value =
                        geoValueMap.get(countryName)
                        ?? null;

                      // Tentukan warna negara
                      const fillColor =
                        value !== null
                          ? getColor(value)
                          : '#e5e7eb';

                      return (

                        // Render negara
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}

                          // Styling negara
                          style={{
                            default: {
                              fill: fillColor,
                              stroke: '#d1d5db',
                              strokeWidth: 0.5,
                              outline: 'none',
                            },

                            // Style saat hover
                            hover: {
                              fill: '#0077B6',
                              stroke: '#9ca3af',
                              strokeWidth: 1,
                              outline: 'none',
                            },

                            // Style saat ditekan
                            pressed: {
                              fill: '#005f8e',
                              outline: 'none',
                            },
                          }}

                          // Saat mouse masuk negara
                          onMouseEnter={(evt) => {

                            // Hitung posisi tooltip
                            const pos =
                              getRelativePosition(evt, mapContainer);

                            // Tampilkan tooltip
                            setTooltip({
                              visible: true,
                              x: pos.x,
                              y: pos.y,
                              countryName,
                              value
                            });
                          }}

                          // Saat mouse bergerak
                          onMouseMove={(evt: React.MouseEvent) => {

                            // Update posisi tooltip
                            const pos =
                              getRelativePosition(evt, mapContainer);

                            setTooltip(prev => ({
                              ...prev,
                              x: pos.x,
                              y: pos.y
                            }));
                          }}

                          // Saat mouse keluar negara
                          onMouseLeave={() =>
                            setTooltip(prev => ({
                              ...prev,
                              visible: false
                            }))
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


      {/* Legend warna */}
      <div className="mt-4 flex flex-wrap items-center justify-end gap-3 text-xs">

        {/* 1000+ */}
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-[#1d4ed8]"></span>
          <span>1000+</span>
        </div>

        {/* 500 - 999 */}
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-[#2563eb]"></span>
          <span>500 - 999</span>
        </div>

        {/* 200 - 499 */}
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-[#3b82f6]"></span>
          <span>200 - 499</span>
        </div>

        {/* 1 - 199 */}
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-[#60a5fa]"></span>
          <span>1 - 199</span>
        </div>

        {/* Tidak ada data */}
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-[#e5e7eb]"></span>
          <span>Tidak ada data</span>
        </div>
      </div>
    </div>
  );
}