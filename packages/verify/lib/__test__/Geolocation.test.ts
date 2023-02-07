import { scaledLocation, unscaledLocation } from "./fixtures";
import { Geolocation, ScaledGeolocation } from "../Geolocation";

describe("Geolocation", () => {
  describe("constructor", () => {
    test("should init without props", () => {
      const geolocation = new Geolocation();
      expect(geolocation).toBeInstanceOf(Geolocation);
      expect(geolocation.isMainnet).toBe(false);
    });
    test("should init mainnet", () => {
      const geolocation = new Geolocation({ isMainnet: true });
      expect(geolocation.isMainnet).toBe(true);
    });
  });

  describe("getters", () => {
    let geolocation: Geolocation;
    beforeEach(() => {
      geolocation = new Geolocation();
    });
    test("should get isMainnet", () => {
      expect(geolocation.isMainnet).toBe(false);
    });
    test("should get api", () => {
      expect(geolocation.testApi).toBe(
        "https://geo-test.w3bstream.com/api/pol"
      );
    });
    test("should get mainnet api", () => {
      const geolocation = new Geolocation({ isMainnet: true });
      expect(geolocation.mainApi).toBe("https://geo.w3bstream.com/api/pol");
    });
    test("should get location", () => {
      geolocation.location = unscaledLocation;
      expect(geolocation.location).toEqual(unscaledLocation);
    });
    test("should get location area", () => {
      geolocation.location = unscaledLocation;
      expect(geolocation.locationArea).toEqual({
        latitude: unscaledLocation.latitude,
        longitude: unscaledLocation.longitude,
        distance: unscaledLocation.distance,
      });
    });
    test("should get location time", () => {
      geolocation.location = unscaledLocation;
      expect(geolocation.locationTime).toEqual({
        from: unscaledLocation.from,
        to: unscaledLocation.to,
      });
    });
  });
  describe("setters", () => {
    let geolocation: Geolocation;
    beforeEach(() => {
      geolocation = new Geolocation();
    });
    test("should set location", () => {
      geolocation.location = unscaledLocation;
      expect(geolocation.location).toEqual(unscaledLocation);
      expect(geolocation.locationArea).toEqual({
        latitude: unscaledLocation.latitude,
        longitude: unscaledLocation.longitude,
        distance: unscaledLocation.distance,
      });
      expect(geolocation.locationTime).toEqual({
        from: unscaledLocation.from,
        to: unscaledLocation.to,
      });
    });
    test("should throw error on invalid latitude", () => {
      expect(() => {
        geolocation.location = { ...unscaledLocation, latitude: 1000 };
      }).toThrow();
    });
    test("should throw error on invalid longitude", () => {
      expect(() => {
        geolocation.location = { ...unscaledLocation, longitude: 1000 };
      }).toThrow();
    });
    test("should throw error on invalid distance", () => {
      expect(() => {
        geolocation.location = { ...unscaledLocation, distance: -1 };
      }).toThrow();
    });
    test("should throw error on invalid from", () => {
      expect(() => {
        geolocation.location = { ...unscaledLocation, from: -1 };
      }).toThrow();
    });
    test("should throw error on invalid to", () => {
      expect(() => {
        geolocation.location = { ...unscaledLocation, to: -1 };
      }).toThrow();
    });
    test("should throw if From is greater then To", () => {
      expect(() => {
        geolocation.location = { ...unscaledLocation, from: 100, to: 1 };
      }).toThrow();
    });
  });
});

describe("ScaledGeolocation", () => {
  describe("constructor", () => {
    test("should init without props", () => {
      const geolocation = new ScaledGeolocation();
      expect(geolocation).toBeInstanceOf(ScaledGeolocation);
      expect(geolocation.isMainnet).toBe(false);
    });
    test("should init mainnet", () => {
      const geolocation = new Geolocation({ isMainnet: true });
      expect(geolocation.isMainnet).toBe(true);
    });
  });
  describe("setters", () => {
    let geolocation: ScaledGeolocation;
    beforeEach(() => {
      geolocation = new ScaledGeolocation();
    });
    test("should set unscaled location and update scaled location", () => {
      geolocation.location = unscaledLocation;
      expect(geolocation.locationArea).toEqual({
        latitude: unscaledLocation.latitude,
        longitude: unscaledLocation.longitude,
        distance: unscaledLocation.distance,
      });
      expect(geolocation.scaledLocation).toEqual({
        scaled_latitude: Math.round(unscaledLocation.latitude * 1000000),
        scaled_longitude: Math.round(unscaledLocation.longitude * 1000000),
        distance: unscaledLocation.distance,
      });
    });
    test("should set scaled location and update unscaled location", () => {
      geolocation.scaledLocation = scaledLocation;
      expect(geolocation.locationArea).toEqual({
        latitude: scaledLocation.scaled_latitude / 1000000,
        longitude: scaledLocation.scaled_longitude / 1000000,
        distance: scaledLocation.distance,
      });
      expect(geolocation.scaledLocation).toEqual({
        scaled_latitude: scaledLocation.scaled_latitude,
        scaled_longitude: scaledLocation.scaled_longitude,
        distance: scaledLocation.distance,
      });
    });
  });
});

// describe.skip("Verify location", () => {
//   test("should verify mock location", async () => {
//     jest.spyOn(axios, "post").mockResolvedValue({
//       data: {
//         result: {
//           data: [
//             {
//               scaled_latitude: locationOne.scaled_latitude,
//               scaled_longitude: locationOne.scaled_longitude,
//               distance: locationOne.distance,
//               from: Number(locationOne.from),
//               to: Number(locationOne.to),
//               devicehash: "devicehash",
//               signature: "signature",
//             },
//           ],
//         },
//       },
//     });

//     const geolocation = new Geolocation(GEOSTREAM_API);
//     await geolocation.verifyLocation(
//       locations,
//       owner,
//       signature,
//       message
//     );
//   });
//   test("should init with location", () => {
//     const geolocation = new Geolocation(GEOSTREAM_API, locationOne);
//     expect(geolocation.location).toEqual(locationOne);
//   })
// });
