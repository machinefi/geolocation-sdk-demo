export type LocationSiweProps = {
  domain: string;  // domain of the request, e.g. example.com
  address: string;
  uri: string;  // origin of the request, e.g. https://example.com
  latitude: string;  // range [-90, 90]
  longitude: string;  // range [-180, 180]
  distance: string;  // range [0, infinity), meters
  from: string;  // timestamp, seconds
  to: string;  // timestamp, seconds
};

export type ParsedLocationSiweProps = {
  latitude: number;
  longitude: number;
  distance: number;
  from: string;
  to: string;
};
