
// File Declaration Type untuk react-simple-maps
//
// File ini digunakan untuk membantu TypeScript
// memahami struktur library react-simple-maps.
//
// Karena beberapa package kadang tidak memiliki
// type bawaan yang lengkap, maka kita membuat
// deklarasi manual sendiri.
//
// Dengan file ini:
// ✅ Autocomplete menjadi lebih baik
// ✅ Error TypeScript berkurang
// ✅ Struktur props lebih jelas
// ✅ Developer lebih mudah memahami component
//

// Membuat deklarasi module untuk react-simple-maps
declare module 'react-simple-maps' {

  // Import React type
  import * as React from 'react';


  // Props untuk ComposableMap
  //
  // ComposableMap adalah container utama map
  //
  export interface ComposableMapProps {

    // Lebar map
    width?: number;

    // Tinggi map
    height?: number;

    // Jenis projection map
    // Contoh:
    // geoMercator
    // geoEqualEarth
    projection?: string | ((width: number, height: number) => unknown);

    // Konfigurasi projection
    projectionConfig?: {

      // Skala zoom map
      scale?: number;

      // Titik tengah map
      center?: [number, number];

      // Rotasi map
      rotation?: [number, number, number];

      // Property tambahan lain
      [key: string]: unknown;
    };

    // Class CSS
    className?: string;

    // Inline style React
    style?: React.CSSProperties;

    // Children component di dalam map
    children?: React.ReactNode;
  }


  // Export component ComposableMap
  export const ComposableMap: React.FC<ComposableMapProps>;



  // Props untuk Geographies
  //
  // Geographies digunakan untuk membaca data GeoJSON
  // lalu mengubahnya menjadi kumpulan negara/wilayah
  //
  export interface GeographiesProps {

    // Sumber data geography
    // Bisa berupa URL atau object GeoJSON
    geography: string | Record<string, unknown>;

    // Render function untuk menampilkan data geography
    children: (data: {
      geographies: GeoGeometry[]
    }) => React.ReactNode;
  }


  // Export component Geographies
  export const Geographies: React.FC<GeographiesProps>;



  // Struktur data geography
  //
  // Merepresentasikan satu wilayah / negara
  //
  export interface GeoGeometry {

    // Tipe geometry
    // Contoh:
    // Polygon
    // MultiPolygon
    type: string;

    // Key unik geography
    rsmKey: string;

    // Property tambahan
    // Biasanya berisi nama negara dll
    properties?: Record<string, unknown>;

    // Property bebas lainnya
    [key: string]: unknown;
  }



  // Props untuk Geography
  //
  // Geography digunakan untuk render
  // satu negara/wilayah
  //
  export interface GeographyProps {

    // Data geography negara
    geography: GeoGeometry;

    // Class CSS
    className?: string;

    // Styling geography
    style?: {

      // Style normal/default
      default?: React.CSSProperties;

      // Style saat hover
      hover?: React.CSSProperties;

      // Style saat ditekan
      pressed?: React.CSSProperties;

    } | React.CSSProperties;

    // Event saat mouse masuk
    onMouseEnter?: (evt: React.MouseEvent) => void;

    // Event saat mouse keluar
    onMouseLeave?: (evt: React.MouseEvent) => void;

    // Event saat di klik
    onClick?: (evt: React.MouseEvent) => void;

    // Property tambahan bebas
    [key: string]: unknown;
  }


  // Export component Geography
  export const Geography: React.FC<GeographyProps>;



  // Struktur posisi map
  //
  // Digunakan untuk zoom dan movement map
  //
  export interface Position {

    // Posisi horizontal
    x: number;

    // Posisi vertical
    y: number;

    // Nilai zoom / scale
    k: number;
  }



  // Props untuk ZoomableGroup
  //
  // ZoomableGroup digunakan agar map
  // bisa di zoom dan dipindahkan
  //
  export interface ZoomableGroupProps {

    // Titik tengah map
    center?: [number, number];

    // Nilai zoom
    zoom?: number;

    // Zoom maksimum
    maxZoom?: number;

    // Zoom minimum
    minZoom?: number;

    // Event saat pergerakan map selesai
    onMoveEnd?: (position: Position) => void;

    // Child component
    children?: React.ReactNode;

    // Property tambahan lainnya
    [key: string]: unknown;
  }


  // Export component ZoomableGroup
  export const ZoomableGroup: React.FC<ZoomableGroupProps>;



  // Props untuk Marker
  //
  // Marker digunakan untuk menampilkan
  // titik/lokasi pada map
  //
  export interface MarkerProps {

    // Koordinat marker
    // Format:
    // [longitude, latitude]
    coordinates: [number, number];

    // Styling marker
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };

    // Event mouse masuk
    onMouseEnter?: (evt: React.MouseEvent) => void;

    // Event mouse keluar
    onMouseLeave?: (evt: React.MouseEvent) => void;

    // Event click
    onClick?: (evt: React.MouseEvent) => void;

    // Isi marker
    children?: React.ReactNode;

    // Property tambahan lainnya
    [key: string]: unknown;
  }


  // Export component Marker
  export const Marker: React.FC<MarkerProps>;



  // Props untuk Line
  //
  // Line digunakan untuk menggambar garis
  // antar titik pada map
  //
  export interface LineProps {

    // Titik awal garis
    from: [number, number];

    // Titik akhir garis
    to: [number, number];

    // Warna garis
    stroke?: string;

    // Ketebalan garis
    strokeWidth?: number;

    // Bentuk ujung garis
    strokeLinecap?: string;

    // Styling line
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };

    // Property tambahan bebas
    [key: string]: unknown;
  }


  // Export component Line
  export const Line: React.FC<LineProps>;
}