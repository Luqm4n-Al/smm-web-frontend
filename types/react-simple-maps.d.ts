// src/types/react-simple-maps.d.ts
declare module 'react-simple-maps' {
  import * as React from 'react';

  export interface ComposableMapProps {
    width?: number;
    height?: number;
    projection?: string | ((width: number, height: number) => unknown);
    projectionConfig?: {
      scale?: number;
      center?: [number, number];
      rotation?: [number, number, number];
      [key: string]: unknown;
    };
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  export const ComposableMap: React.FC<ComposableMapProps>;

  export interface GeographiesProps {
    geography: string | Record<string, unknown>;
    children: (data: { geographies: GeoGeometry[] }) => React.ReactNode;
  }

  export const Geographies: React.FC<GeographiesProps>;

  export interface GeoGeometry {
    type: string;
    rsmKey: string;
    properties?: Record<string, unknown>;
    [key: string]: unknown;
  }

  export interface GeographyProps {
    geography: GeoGeometry;
    className?: string;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    } | React.CSSProperties;
    onMouseEnter?: (evt: React.MouseEvent) => void;
    onMouseLeave?: (evt: React.MouseEvent) => void;
    onClick?: (evt: React.MouseEvent) => void;
    [key: string]: unknown;
  }

  export const Geography: React.FC<GeographyProps>;

  export interface Position {
    x: number;
    y: number;
    k: number;
  }

  export interface ZoomableGroupProps {
    center?: [number, number];
    zoom?: number;
    maxZoom?: number;
    minZoom?: number;
    onMoveEnd?: (position: Position) => void;
    children?: React.ReactNode;
    [key: string]: unknown;
  }

  export const ZoomableGroup: React.FC<ZoomableGroupProps>;

  export interface MarkerProps {
    coordinates: [number, number];
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
    onMouseEnter?: (evt: React.MouseEvent) => void;
    onMouseLeave?: (evt: React.MouseEvent) => void;
    onClick?: (evt: React.MouseEvent) => void;
    children?: React.ReactNode;
    [key: string]: unknown;
  }

  export const Marker: React.FC<MarkerProps>;

  export interface LineProps {
    from: [number, number];
    to: [number, number];
    stroke?: string;
    strokeWidth?: number;
    strokeLinecap?: string;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
    [key: string]: unknown;
  }

  export const Line: React.FC<LineProps>;
}