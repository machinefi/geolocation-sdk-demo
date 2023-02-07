import generateSiweMsg from "../generate-siwe-msg";
import { LocationSiweProps } from "../types";

const singleLocation: LocationSiweProps = {
  domain: "siwe.io",
  address: "0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E",
  uri: "https://siwe.io",
  latitude: -45.5,
  longitude: 123,
  distance: 123,
  from: Date.now(),
  to: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days from now
};

describe("Generate SIWE message", () => {
  test("should generate correct message", () => {
    const msg = generateSiweMsg(singleLocation);
    console.log(msg);
    expect(msg).toContain(singleLocation.domain);
    expect(msg).toContain(singleLocation.address);
    expect(msg).toContain(singleLocation.uri);
    expect(msg).toContain(`latitude: ${singleLocation.latitude},`);
    expect(msg).toContain(`longitude: ${singleLocation.longitude},`);
    expect(msg).toContain(
      `maximum distance of ${singleLocation.distance} meters`
    );
    expect(msg).toContain(
      `between ${new Date(singleLocation.from).toLocaleDateString()}`
    );
    expect(msg).toContain(
      `and ${new Date(singleLocation.to).toLocaleDateString()}`
    );
  });
  describe("Parameters validation", () => {
    test("should fail if domain is not provided", () => {
      expect(() => generateSiweMsg({ ...singleLocation, domain: "" })).toThrow(
        "Domain is required"
      );
    });
    test("should fail if uri is not provided", () => {
      expect(() => generateSiweMsg({ ...singleLocation, uri: "" })).toThrow(
        "URI is required"
      );
    });
    describe("Address validation", () => {
      test("should fail if address is not provided", () => {
        expect(() =>
          generateSiweMsg({ ...singleLocation, address: "" })
        ).toThrow("Address is required");
      });
      test("should fail if address is not valid", () => {
        expect(() =>
          generateSiweMsg({ ...singleLocation, address: "test" })
        ).toThrow("Address is invalid");
      });
      test("should fail if address is zero address", () => {
        expect(() =>
          generateSiweMsg({
            ...singleLocation,
            address: "0x0000000000000000000000000000000000000000",
          })
        ).toThrow("Zero address is invalid");
      });
    });
    describe("Latitude validation", () => {
      test("should fail if latitude is not in range", () => {
        expect(() =>
          generateSiweMsg({ ...singleLocation, latitude: 90.000001 })
        ).toThrow("Latitude is out of range");
        expect(() =>
          generateSiweMsg({ ...singleLocation, latitude: -90.000001 })
        ).toThrow("Latitude is out of range");
      });
      test("should not fail if latitude is in range", () => {
        expect(() =>
          generateSiweMsg({ ...singleLocation, latitude: 90.0 })
        ).not.toThrow();
        expect(() =>
          generateSiweMsg({ ...singleLocation, latitude: 45 })
        ).not.toThrow();
        expect(() =>
          generateSiweMsg({ ...singleLocation, latitude: -90.0 })
        ).not.toThrow();
        expect(() =>
          generateSiweMsg({ ...singleLocation, latitude: 47.123121 })
        ).not.toThrow();
        expect(() =>
          generateSiweMsg({ ...singleLocation, latitude: 0 })
        ).not.toThrow();
      });
    });
    describe("Longitude validation", () => {
      test("should fail if longitude is not in range", () => {
        expect(() =>
          generateSiweMsg({ ...singleLocation, longitude: 180.000001 })
        ).toThrow("Longitude is out of range");
        expect(() =>
          generateSiweMsg({ ...singleLocation, longitude: -180.000001 })
        ).toThrow("Longitude is out of range");
      });
      test("should not fail if longitude is in range", () => {
        expect(() =>
          generateSiweMsg({ ...singleLocation, longitude: 180.0 })
        ).not.toThrow();
        expect(() =>
          generateSiweMsg({ ...singleLocation, longitude: 123 })
        ).not.toThrow();
        expect(() =>
          generateSiweMsg({ ...singleLocation, longitude: -180.0 })
        ).not.toThrow();
        expect(() =>
          generateSiweMsg({ ...singleLocation, longitude: 47.123121 })
        ).not.toThrow();
        expect(() =>
          generateSiweMsg({ ...singleLocation, longitude: 0 })
        ).not.toThrow();
      });
    });
    describe("Distance validation", () => {
      test("should fail if distance is not in range", () => {
        expect(() =>
          generateSiweMsg({ ...singleLocation, distance: -0.01 })
        ).toThrow("Distance is out of range");
        expect(() =>
          generateSiweMsg({ ...singleLocation, distance: -1 })
        ).toThrow("Distance is out of range");
        expect(() =>
          generateSiweMsg({ ...singleLocation, distance: 0 })
        ).toThrow("Distance is out of range");
      });
      test("should not fail if distance is in range", () => {
        expect(() =>
          generateSiweMsg({ ...singleLocation, distance: 0.01 })
        ).not.toThrow();
        expect(() =>
          generateSiweMsg({ ...singleLocation, distance: 1 })
        ).not.toThrow();
        expect(() =>
          generateSiweMsg({ ...singleLocation, distance: 1.01 })
        ).not.toThrow();
        expect(() =>
          generateSiweMsg({ ...singleLocation, distance: 100 })
        ).not.toThrow();
      });
    });
    describe("Time validation", () => {
      test("should fail if from is not in range", () => {
        expect(() => generateSiweMsg({ ...singleLocation, from: -1 })).toThrow(
          "From is out of range"
        );
      });
      test("should fail if to is not in range", () => {
        expect(() => generateSiweMsg({ ...singleLocation, to: -1 })).toThrow(
          "To is out of range"
        );
      });
      test("should fail is From is greater then To", () => {
        expect(() =>
          generateSiweMsg({ ...singleLocation, from: 2, to: 1 })
        ).toThrow("From is greater or equals To");
      });
      test("should fail if From is equal to To", () => {
        expect(() =>
          generateSiweMsg({ ...singleLocation, from: 1, to: 1 })
        ).toThrow("From is greater or equals To");
      });
      test("should not fail if From is less then To", () => {
        expect(() =>
          generateSiweMsg({ ...singleLocation, from: 1, to: 2 })
        ).not.toThrow();
      });
      test("should not fail if From and To are in range", () => {
        expect(() =>
          generateSiweMsg({ ...singleLocation, from: 0, to: 1 })
        ).not.toThrow();
        expect(() =>
          generateSiweMsg({ ...singleLocation, from: 1, to: 2 })
        ).not.toThrow();
        expect(() =>
          generateSiweMsg({ ...singleLocation, from: 23, to: 24 })
        ).not.toThrow();
      });
    });
  });
});
