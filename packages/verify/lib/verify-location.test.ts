import axios from "axios";
import Geolocation from "./verify-location";
import { Location } from "./types";

const locationOne: Location = {
  scaled_latitude: 407127753,
  scaled_longitude: -740059728,
  distance: 1000,
  from: "1",
  to: "10",
};
const locations: Location[] = [locationOne];
const owner = "0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E";
const signature =
  "0x7337bc2826c7678cd6bc84f5b3b236efc969b0451f9feca2328b1d3401b030c113f19bdba359ba3f52762c66e9147311fa95fe598a1a4ec9bb383a7b4e3874241b";
const message = `siwe.io wants you to sign in with your Ethereum account:
0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E

The application will know if you were located in the following region with latitude: -45.5, longitude: 123, and within a maximum distance of 123 meters, between 2/6/2023, and 2/13/2023

URI: https://siwe.io
Version: 1
Chain ID: 4690
Nonce: XRgMAiShdzGZYfwTK
Issued At: 2023-02-06T21:56:13.210Z
Expiration Time: 2023-02-06T22:01:13.209Z`;
const GEOSTREAM_API = "https://mock.com/api";

describe("Verify location", () => {
  test("should verify mock location", async () => {
    jest.spyOn(axios, "post").mockResolvedValue({
      data: {
        result: {
          data: [
            {
              scaled_latitude: locationOne.scaled_latitude,
              scaled_longitude: locationOne.scaled_longitude,
              distance: locationOne.distance,
              from: Number(locationOne.from),
              to: Number(locationOne.to),
              devicehash: "devicehash",
              signature: "signature",
            },
          ],
        },
      },
    });

    const geolocation = new Geolocation(GEOSTREAM_API);
    const verificationResult = await geolocation.verifyLocation(
      locations,
      owner,
      signature,
      message
    );
  });
  test.only("should return empty array if no verified locations", () => {})
});
