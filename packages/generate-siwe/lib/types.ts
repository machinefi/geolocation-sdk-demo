import { SiweMessage } from "siwe";

export type LocationISOTime = {
  from: string; // ISO time
  to: string; // ISO time
};

export type LocationTimestampMs = {
  from: number; // timestamp, unix milliseconds
  to: number; // timestamp, unix milliseconds
};

export type LocationTimestampSeconds = {
  from: number; // timestamp, unix seconds
  to: number; // timestamp, unix seconds
};

type Distance = {
  distance: number; // range [0, infinity), meters
};

export type LocationArea = Distance & {
  latitude: number; // range [-90, 90]
  longitude: number; // range [-180, 180]
};

export type ScaledLocationArea = Distance & {
  scaled_latitude: number; // range [-9000000000, 9000000000]
  scaled_longitude: number; // range [-18000000000, 18000000000]
};
export type Location = LocationTimestampMs & LocationArea;

export type ParsedLocationSiweProps = LocationISOTime & LocationArea;

export type LocationSiweProps = Location & Partial<SiweMessage>;
