export type LocationTimestamp = {
  from: number; // timestamp, unix milliseconds
  to: number; // timestamp, unix milliseconds
};

export type LocationISOTime = {
  from: string; // ISO time
  to: string; // ISO time
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
