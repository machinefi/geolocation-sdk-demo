import {
  mockDomain,
  mockUri,
  mockOwner,
  scaledLocation,
  unscaledLocation,
  mockSignature,
} from "./fixtures";
import {
  Geolocation,
  GeolocationSiwe,
  GeolocationVerifier,
} from "../Geolocation";
import axios from "axios";

describe("Geolocation", () => {
  describe("constructor", () => {
    test("should init without props", () => {
      const geolocation = new Geolocation();
      expect(geolocation).toBeInstanceOf(Geolocation);
      expect(geolocation.location).toBeNull();
      expect(geolocation.locationArea).toBeNull();
      expect(geolocation.locationTime).toBeNull();
      expect(geolocation.scaledLocationArea).toBeNull();
    });
  });
  describe("getters", () => {
    let geolocation: Geolocation;
    beforeEach(() => {
      geolocation = new Geolocation();
    });
    test("should get location", () => {
      geolocation.location = unscaledLocation;
      expect(geolocation.location).toEqual(unscaledLocation);
    });
    test("should get unset location", () => {
      expect(geolocation.location).toBeNull();
    });
    test("should get location area", () => {
      geolocation.location = unscaledLocation;
      expect(geolocation.locationArea).toEqual({
        latitude: unscaledLocation.latitude,
        longitude: unscaledLocation.longitude,
        distance: unscaledLocation.distance,
      });
    });
    test("should get unset location area", () => {
      expect(geolocation.locationArea).toBeNull();
    });
    test("should get location time", () => {
      geolocation.location = unscaledLocation;
      expect(geolocation.locationTime).toEqual({
        from: unscaledLocation.from,
        to: unscaledLocation.to,
      });
    });
    test("should get unset location time", () => {
      expect(geolocation.locationTime).toBeNull();
    });
    test("should get scaled location area", () => {
      geolocation.location = unscaledLocation;
      expect(geolocation.scaledLocationArea).toEqual({
        scaled_latitude: unscaledLocation.latitude * Math.pow(10, 6),
        scaled_longitude: unscaledLocation.longitude * Math.pow(10, 6),
        distance: unscaledLocation.distance,
      });
    });
    test("should get unset scaled location area", () => {
      expect(geolocation.scaledLocationArea).toBeNull();
    });
    test("should get scaled location", () => {
      geolocation.location = unscaledLocation;
      expect(geolocation.scaledLocation).toEqual({
        scaled_latitude: unscaledLocation.latitude * Math.pow(10, 6),
        scaled_longitude: unscaledLocation.longitude * Math.pow(10, 6),
        distance: unscaledLocation.distance,
        from: Math.round(unscaledLocation.from / 1000),
        to: Math.round(unscaledLocation.to / 1000),
      });
    });
    test("should get unset scaled location", () => {
      expect(geolocation.scaledLocation).toBeNull();
    });
    test("should get scaled location time", () => {
      geolocation.location = unscaledLocation;
      expect(geolocation.scaledLocationTime).toEqual({
        from: Math.round(unscaledLocation.from / 1000),
        to: Math.round(unscaledLocation.to / 1000),
      });
    });
    test("should get unset scaled location time", () => {
      expect(geolocation.scaledLocationTime).toBeNull();
    });
  });
  describe("setters", () => {
    let geolocation: Geolocation;
    beforeEach(() => {
      geolocation = new Geolocation();
    });
    describe("location", () => {
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
      test("should set location and update scaled location", () => {
        geolocation.location = unscaledLocation;
        expect(geolocation.locationArea).toEqual({
          latitude: unscaledLocation.latitude,
          longitude: unscaledLocation.longitude,
          distance: unscaledLocation.distance,
        });
        expect(geolocation.scaledLocation).toEqual({
          scaled_latitude: Math.round(unscaledLocation.latitude * 1000_000),
          scaled_longitude: Math.round(unscaledLocation.longitude * 1000_000),
          distance: unscaledLocation.distance,
          from: Math.round(unscaledLocation.from / 1000),
          to: Math.round(unscaledLocation.to / 1000),
        });
      });
    });
    describe("scaled location", () => {
      test("should set scaled location area", () => {
        geolocation.scaledLocationArea = scaledLocation;
        expect(geolocation.locationArea).toEqual({
          latitude: scaledLocation.scaled_latitude / 1000_000,
          longitude: scaledLocation.scaled_longitude / 1000_000,
          distance: scaledLocation.distance,
        });
        expect(geolocation.scaledLocationArea).toEqual({
          scaled_latitude: scaledLocation.scaled_latitude,
          scaled_longitude: scaledLocation.scaled_longitude,
          distance: scaledLocation.distance,
        });
      });
      test("should throw error on invalid scaled latitude", () => {
        expect(() => {
          geolocation.scaledLocationArea = {
            ...scaledLocation,
            scaled_latitude: 1000_000_000,
          };
        }).toThrow();
      });
      test("should throw error on invalid scaled longitude", () => {
        expect(() => {
          geolocation.scaledLocationArea = {
            ...scaledLocation,
            scaled_longitude: 1000_000_000,
          };
        }).toThrow();
      });
      test("should throw error on invalid scaled distance", () => {
        expect(() => {
          geolocation.scaledLocationArea = {
            ...scaledLocation,
            distance: -1,
          };
        }).toThrow();
      });
      test("should set scaled location time", () => {
        geolocation.scaledLocationTime = {
          from: scaledLocation.from,
          to: scaledLocation.to,
        };
        expect(geolocation.locationTime).toEqual({
          from: scaledLocation.from * 1000,
          to: scaledLocation.to * 1000,
        });
        expect(geolocation.scaledLocationTime).toEqual({
          from: scaledLocation.from,
          to: scaledLocation.to,
        });
      });
      test("should throw error on invalid scaled from", () => {
        expect(() => {
          geolocation.scaledLocationTime = {
            ...scaledLocation,
            from: -1,
          };
        }).toThrow();
      });
      test("should throw error on invalid scaled to", () => {
        expect(() => {
          geolocation.scaledLocationTime = {
            ...scaledLocation,
            to: -1,
          };
        }).toThrow();
      });
      test("should throw if scaled From is greater then scaled To", () => {
        expect(() => {
          geolocation.scaledLocationTime = {
            ...scaledLocation,
            from: 100,
            to: 1,
          };
        }).toThrow();
      });
      test("should set scaled location", () => {
        geolocation.scaledLocation = scaledLocation;
        expect(geolocation.locationArea).toEqual({
          latitude: scaledLocation.scaled_latitude / 1000_000,
          longitude: scaledLocation.scaled_longitude / 1000_000,
          distance: scaledLocation.distance,
        });
        expect(geolocation.locationTime).toEqual({
          from: scaledLocation.from * 1000,
          to: scaledLocation.to * 1000,
        });
        expect(geolocation.scaledLocation).toEqual(scaledLocation);
      });
    });
  });
});

describe("GeolocationSiwe", () => {
  let geolocation: GeolocationSiwe;
  beforeEach(() => {
    geolocation = new GeolocationSiwe();
  });
  describe("getters and setters", () => {
    test("should get signature", () => {
      geolocation.signature = mockSignature;
      expect(geolocation.signature).toEqual(mockSignature);
    });
    test("should get unset signature", () => {
      expect(geolocation.signature).toBeNull();
    });
    test("should get unset message", () => {
      expect(geolocation.message).toBeNull();
    });
    test("should get unset owner", () => {
      expect(geolocation.owner).toBeNull();
    });
  });
  describe("siwe message", () => {
    test("should generate siwe message with location", () => {
      geolocation.location = unscaledLocation;
      const msg = geolocation.generateSiweMessage({
        domain: mockDomain,
        uri: mockUri,
        address: mockOwner,
      });
      expect(msg).toContain(mockDomain);
      expect(msg).toContain(mockUri);
      expect(msg).toContain(mockOwner);
    });
    test("should generate siwe message with scaled location", () => {
      geolocation.scaledLocation = scaledLocation;
      const msg = geolocation.generateSiweMessage({
        domain: mockDomain,
        uri: mockUri,
        address: mockOwner,
      });
      console.log(msg);
      expect(msg).toContain(mockDomain);
      expect(msg).toContain(mockUri);
      expect(msg).toContain(mockOwner);
    });
    test("should throw if location is not set", () => {
      expect(() => {
        geolocation.generateSiweMessage({
          domain: mockDomain,
          uri: mockUri,
          address: mockOwner,
        });
      }).toThrow("Missing location area or time");
    });
  });
});

describe("GeolocationVerifier", () => {
  let geoVerifier: GeolocationVerifier;
  beforeEach(() => {
    geoVerifier = new GeolocationVerifier();
  });
  test("should verify location", async () => {
    geoVerifier.location = unscaledLocation;

    const returnDataOne = {
      ...geoVerifier.scaledLocationArea,
      from: Number(geoVerifier.location.from),
      to: Number(geoVerifier.location.to),
      devicehash: "devicehash",
      signature: "signature",
    };

    jest.spyOn(axios, "post").mockResolvedValue({
      status: 200,
      data: {
        result: {
          data: [returnDataOne],
        },
      },
    });

    geoVerifier.generateSiweMessage({
      domain: mockDomain,
      uri: mockUri,
      address: mockOwner,
    });
    geoVerifier.signature = mockSignature;
    await expect(geoVerifier.verifyLocation()).resolves.toEqual([
      returnDataOne,
    ]);
  });
  test("should verify location with scaled location", async () => {
    geoVerifier.scaledLocation = scaledLocation;

    const returnDataOne = {
      ...geoVerifier.scaledLocationArea,
      from: Number(geoVerifier.location.from),
      to: Number(geoVerifier.location.to),
      devicehash: "devicehash",
      signature: "signature",
    };

    jest.spyOn(axios, "post").mockResolvedValue({
      status: 200,
      data: {
        result: {
          data: [returnDataOne],
        },
      },
    });

    geoVerifier.generateSiweMessage({
      domain: mockDomain,
      uri: mockUri,
      address: mockOwner,
    });
    geoVerifier.signature = mockSignature;
    await expect(geoVerifier.verifyLocation()).resolves.toEqual([
      returnDataOne,
    ]);
  });
  test("should throw if signature is not set", async () => {
    geoVerifier.location = unscaledLocation;

    geoVerifier.generateSiweMessage({
      domain: mockDomain,
      uri: mockUri,
      address: mockOwner,
    });
    await expect(geoVerifier.verifyLocation()).rejects.toThrow(
      "Missing location signature, message or owner"
    );
  });
  test("should throw if response is not 200", async () => {
    geoVerifier.scaledLocation = scaledLocation;

    jest.spyOn(axios, "post").mockResolvedValue({
      status: 400,
      data: {
        result: {
          data: [
            {
              ...geoVerifier.scaledLocationArea,
              from: Number(geoVerifier.location.from),
              to: Number(geoVerifier.location.to),
              devicehash: "devicehash",
              signature: "signature",
            },
          ],
        },
      },
    });

    geoVerifier.generateSiweMessage({
      domain: mockDomain,
      uri: mockUri,
      address: mockOwner,
    });
    geoVerifier.signature = mockSignature;
    await expect(geoVerifier.verifyLocation()).rejects.toThrow(
      "Querying GeoStream API failed, see console for details"
    );
  });
  test("should return empty array if no data is returned", async () => {
    geoVerifier.scaledLocation = scaledLocation;

    jest.spyOn(axios, "post").mockResolvedValue({
      status: 200,
      data: {
        result: {},
      },
    });

    geoVerifier.generateSiweMessage({
      domain: mockDomain,
      uri: mockUri,
      address: mockOwner,
    });
    geoVerifier.signature = mockSignature;
    await expect(geoVerifier.verifyLocation()).resolves.toEqual([]);
  });
  test("should return empty array if no verified locations are returned", async () => {
    geoVerifier.scaledLocation = scaledLocation;

    jest.spyOn(axios, "post").mockResolvedValue({
      status: 200,
      data: {
        result: {
          data: [],
        },
      },
    });

    geoVerifier.generateSiweMessage({
      domain: mockDomain,
      uri: mockUri,
      address: mockOwner,
    });
    geoVerifier.signature = mockSignature;
    await expect(geoVerifier.verifyLocation()).resolves.toEqual([]);
  });
});
