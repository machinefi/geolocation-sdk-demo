export type LocationSiweProps = {
  domain: string;  // domain of the request, e.g. example.com
  address: string;
  uri: string;  // origin of the request, e.g. https://example.com
  latitude: number;  // range [-90, 90]
  longitude: number;  // range [-180, 180]
  distance: number;  // range [0, infinity), meters
  from: number;  // timestamp, unix milliseconds
  to: number;  // timestamp, unix milliseconds
};

export type ParsedLocationSiweProps = {
  latitude: number;
  longitude: number;
  distance: number;
  from: string;
  to: string;
};
