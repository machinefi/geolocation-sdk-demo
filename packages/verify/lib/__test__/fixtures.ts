import { LocationArea, LocationTimestamp } from "../../../../types";
import { Location } from "../types";

export const scaledLocation: Location = {
  scaled_latitude: -45500000,
  scaled_longitude: 123000000,
  distance: 123,
  from: "1",
  to: "10",
};

export const locations: Location[] = [scaledLocation];
export const mockDomain = "siwe.io";
export const mockUri = `https://${mockDomain}`;
export const mockOwner = "0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E";
export const mockSignature =
  "0x7337bc2826c7678cd6bc84f5b3b236efc969b0451f9feca2328b1d3401b030c113f19bdba359ba3f52762c66e9147311fa95fe598a1a4ec9bb383a7b4e3874241b";
export const mockMessage = `siwe.io wants you to sign in with your Ethereum account:
0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E

The application will know if you were located in the following region with latitude: -45.5, longitude: 123, and within a maximum distance of 123 meters, between 2/6/2023, and 2/13/2023

URI: https://siwe.io
Version: 1
Chain ID: 4690
Nonce: XRgMAiShdzGZYfwTK
Issued At: 2023-02-06T21:56:13.210Z
Expiration Time: 2023-02-06T22:01:13.209Z`;

export const unscaledLocation: LocationTimestamp & LocationArea = {
  latitude: -45.5,
  longitude: 123,
  distance: 123,
  from: Date.now(),
  to: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days from now
};
