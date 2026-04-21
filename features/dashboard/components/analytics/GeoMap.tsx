// src/features/dashboard/components/Analytics/GeoMap.tsx
'use client';

import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { ParentSize } from '@visx/responsive';
import { FiMapPin } from 'react-icons/fi';
import { CSSProperties, useState } from 'react';

// URL ke file TopoJSON dunia (gratis dan publik)
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';

// Data dummy persebaran followers per negara (kode ISO A3)
const followersData: Record<string, number> = {
  IDN: 12500,  // Indonesia
  USA: 8700,   // Amerika Serikat
  IND: 6200,   // India
  BRA: 4100,   // Brasil
  GBR: 3800,   // Inggris
  DEU: 2900,   // Jerman
  FRA: 2700,   // Prancis
  JPN: 2500,   // Jepang
  AUS: 2100,   // Australia
  CAN: 1900,   // Kanada
};

// Fungsi untuk mencari kode ISO berdasarkan nama negara
const getCountryCodeByName = (name: string): string => {
  const nameToCode: Record<string, string> = {
    'Indonesia': 'IDN',
    'India': 'IND',
    'Japan': 'JPN',
    'China': 'CHN',
    'Russia': 'RUS',
    'South Korea': 'KOR',
    'Thailand': 'THA',
    'Vietnam': 'VNM',
    'Philippines': 'PHL',
    'Malaysia': 'MYS',
    'Singapore': 'SGP',
    'Pakistan': 'PAK',
    'Bangladesh': 'BGD',
    'Sri Lanka': 'LKA',
    'Cambodia': 'KHM',
    'Laos': 'LAO',
    'Myanmar': 'MMR',
    'United States': 'USA',
    'Brazil': 'BRA',
    'Canada': 'CAN',
    'Mexico': 'MEX',
    'Argentina': 'ARG',
    'Chile': 'CHL',
    'Colombia': 'COL',
    'Peru': 'PER',
    'Ecuador': 'ECU',
    'Bolivia': 'BOL',
    'Venezuela': 'VEN',
    'Guyana': 'GUY',
    'Suriname': 'SUR',
    'United Kingdom': 'GBR',
    'Germany': 'DEU',
    'France': 'FRA',
    'Italy': 'ITA',
    'Spain': 'ESP',
    'Netherlands': 'NLD',
    'Belgium': 'BEL',
    'Sweden': 'SWE',
    'Norway': 'NOR',
    'Denmark': 'DNK',
    'Poland': 'POL',
    'Ukraine': 'UKR',
    'Romania': 'ROU',
    'Czechia': 'CZE',
    'Hungary': 'HUN',
    'Austria': 'AUT',
    'Switzerland': 'CHE',
    'Greece': 'GRC',
    'Portugal': 'PRT',
    'Ireland': 'IRL',
    'Finland': 'FIN',
    'Slovakia': 'SVK',
    'Slovenia': 'SVN',
    'Croatia': 'HRV',
    'Serbia': 'SRB',
    'Bulgaria': 'BGR',
    'Latvia': 'LVA',
    'Lithuania': 'LTU',
    'Estonia': 'EST',
    'Belarus': 'BLR',
    'Moldova': 'MDA',
    'Uzbekistan': 'UZB',
    'Kazakhstan': 'KAZ',
    'South Africa': 'ZAF',
    'Egypt': 'EGY',
    'Nigeria': 'NGA',
    'Kenya': 'KEN',
    'Ethiopia': 'ETH',
    'Ghana': 'GHA',
    'Uganda': 'UGA',
    'Tanzania': 'TZA',
    'Zimbabwe': 'ZWE',
    'Angola': 'AGO',
    'Mozambique': 'MOZ',
    'Zambia': 'ZMB',
    'Malawi': 'MWI',
    'Somalia': 'SOM',
    'Algeria': 'DZA',
    'Morocco': 'MAR',
    'Tunisia': 'TUN',
    'Libya': 'LBY',
    'Cameroon': 'CMR',
    'Senegal': 'SEN',
    'Benin': 'BEN',
    'Togo': 'TGO',
    'Liberia': 'LBR',
    'Sierra Leone': 'SLE',
    'Gabon': 'GAB',
    'Congo': 'COG',
    'Rwanda': 'RWA',
    'Australia': 'AUS',
    'New Zealand': 'NZL',
    'Fiji': 'FJI',
    'Papua New Guinea': 'PNG',
    'Saudi Arabia': 'SAU',
    'United Arab Emirates': 'ARE',
    'Qatar': 'QAT',
    'Kuwait': 'KWT',
    'Bahrain': 'BHR',
    'Oman': 'OMN',
    'Yemen': 'YEM',
    'Iraq': 'IRQ',
    'Iran': 'IRN',
    'Israel': 'ISR',
    'Palestine': 'PSE',
    'Jordan': 'JOR',
    'Lebanon': 'LBN',
    'Syria': 'SYR',
    'Turkey': 'TUR',
    'Afghanistan': 'AFG',
  };
  
  // Cek nama langsung
  if (nameToCode[name]) {
    return nameToCode[name];
  }
  
  // Coba dengan normalisasi spasi dan kapitalisasi
  const normalized = name.trim();
  for (const [key, value] of Object.entries(nameToCode)) {
    if (key.toLowerCase() === normalized.toLowerCase()) {
      return value;
    }
  }
  
  // Jika tidak ketemu, return nama sebagai fallback
  return name;
};

// Fungsi untuk mendapatkan warna berdasarkan jumlah followers
const getFillColor = (countryCode: string): string => {
  const value = followersData[countryCode];
  if (!value) return '#e5e7eb'; // gray-200
  if (value > 8000) return '#1d4ed8'; // blue-700
  if (value > 5000) return '#3b82f6'; // blue-500
  if (value > 3000) return '#60a5fa'; // blue-400
  return '#93c5fd'; // blue-300
};

interface TooltipData {
  countryCode: string;
  countryName: string;
  followers: number;
  x: number;
  y: number;
}

export function GeoMap() {
  const [hoveredCountry, setHoveredCountry] = useState<TooltipData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const geographyStyle: {
    default: CSSProperties;
    hover: CSSProperties;
    pressed?: CSSProperties;
  } = {
    default: {
      fill: '#e5e7eb',
      stroke: '#ffffff',
      strokeWidth: 0.75,
      outline: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    hover: {
      fill: '#2563eb',
      stroke: '#1e40af',
      strokeWidth: 0.75,
      outline: 'none',
      cursor: 'pointer',
    },
  };

  const handleGeographyMouseEnter = (
    evt: React.MouseEvent,
    countryCode: string,
    countryName: string
  ) => {
    // Gunakan kode untuk cari followers, fallback ke 0
    const followers = followersData[countryCode] || 0;
    const mapContainer = (evt.currentTarget as HTMLElement).closest('.map-container');
    
    if (mapContainer) {
      const mapRect = mapContainer.getBoundingClientRect();
      setTooltipPos({
        x: evt.clientX - mapRect.left,
        y: evt.clientY - mapRect.top,
      });
    }

    setHoveredCountry({
      countryCode,
      countryName,
      followers,
      x: evt.clientX,
      y: evt.clientY,
    });
  };

  const handleGeographyMouseLeave = () => {
    setHoveredCountry(null);
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <FiMapPin className="h-5 w-5 text-gray-400" />
        <h2 className="text-lg font-medium text-gray-900">Persebaran Followers</h2>
        <span className="ml-auto text-xs text-gray-500">Berdasarkan lokasi</span>
      </div>

      <div
        className="map-container relative h-80 w-full overflow-hidden rounded"
        style={{ backgroundColor: '#f9fafb' }}
      >
        <ParentSize>
          {({ width, height }) => (
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: width > 600 ? 120 : 80,
                center: [20, 0],
              }}
              width={width}
              height={height}
            >
              <ZoomableGroup zoom={1}>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      // Debug: Cek properti yang tersedia
                      const props = geo.properties || {};
                      
                      // Coba berbagai kemungkinan property name
                      let countryCode = '';
                      let countryName = 'Unknown';
                      
                      // World-atlas menggunakan properties.name untuk nama negara
                      if (props.name) {
                        countryName = props.name as string;
                        // Map nama ke kode ISO A3
                        countryCode = getCountryCodeByName(countryName);
                      }
                      
                      // Fallback: cek properti lain yang mungkin ada
                      if (!countryCode && props.iso_a3) {
                        countryCode = props.iso_a3 as string;
                      }
                      if (!countryCode && props.iso_a2) {
                        countryCode = props.iso_a2 as string;
                      }
                      if (!countryCode && props.id) {
                        countryCode = props.id as string;
                      }
                      
                      const fillColor = getFillColor(countryCode);
                      
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onMouseEnter={(evt) =>
                            handleGeographyMouseEnter(evt, countryCode, countryName)
                          }
                          onMouseLeave={handleGeographyMouseLeave}
                          style={{
                            default: {
                              ...geographyStyle.default,
                              fill: fillColor,
                            },
                            hover: geographyStyle.hover,
                            pressed: geographyStyle.pressed,
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

        {/* Tooltip/Popup */}
        {hoveredCountry && (
          <div
            className="pointer-events-none absolute z-10 rounded-lg bg-gray-900 px-3 py-2 text-white shadow-lg"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y - 50}px`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="whitespace-nowrap text-sm font-medium">
              {hoveredCountry.countryName}
            </div>
            <div className="text-xs text-gray-200">
              {hoveredCountry.followers.toLocaleString()} followers
            </div>
            {/* Arrow pointing down */}
            <div
              className="absolute left-1/2 -bottom-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-900"
              style={{}}
            />
          </div>
        )}
      </div>
      {/* Legenda */}
      <div className="mt-4 flex flex-wrap items-center justify-end gap-3 text-xs">
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-[#1d4ed8]"></span>
          <span>&gt;8k</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-[#3b82f6]"></span>
          <span>5k - 8k</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-[#60a5fa]"></span>
          <span>3k - 5k</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-[#93c5fd]"></span>
          <span>1k - 3k</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-sm bg-[#e5e7eb]"></span>
          <span>Data tidak tersedia</span>
        </div>
      </div>
    </div>
  );
}