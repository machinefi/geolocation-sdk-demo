import generateSiweMsg from "./generate-siwe-msg";
import { LocationSiweProps } from "./types";

const singleLocation: LocationSiweProps = {
  domain: "siwe.io",
  address: "0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E",
  uri: "https://siwe.io",
  latitude: "45.5",
  longitude: "123",
  distance: "123",
  from: "123",
  to: "123",
};

describe("Generate SIWE message", () => {
  test("should run", () => {
    const msg = generateSiweMsg(singleLocation);
    console.log(msg);
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
      test("should fail if latitude is not provided", () => {
        expect(() =>
          generateSiweMsg({ ...singleLocation, latitude: "" })
        ).toThrow("Latitude is required");
      });
      test("should fail if latitude is not valid", () => {
        expect(() =>
          generateSiweMsg({ ...singleLocation, latitude: "test" })
        ).toThrow("Latitude is invalid");
      });
      test("should fail if latitude is not in range", () => {
        expect(() =>
          generateSiweMsg({ ...singleLocation, latitude: "90.00000001" })
        ).toThrow("Latitude is out of range");
        expect(() =>
          generateSiweMsg({ ...singleLocation, latitude: "-90.00000001" })
        ).toThrow("Latitude is out of range");
      });
      test("should not fail if latitude is in range", () => {
        expect(() =>
          generateSiweMsg({ ...singleLocation, latitude: "90.0" })
        ).not.toThrow("Latitude is out of range");
        expect(() =>
          generateSiweMsg({ ...singleLocation, latitude: "45" })
        ).not.toThrow("Latitude is out of range");
        expect(() =>
          generateSiweMsg({ ...singleLocation, latitude: "-90.000" })
        ).not.toThrow("Latitude is out of range");
        expect(() =>
          generateSiweMsg({ ...singleLocation, latitude: "47.1231231" })
        ).not.toThrow("Latitude is out of range");
        expect(() =>
          generateSiweMsg({ ...singleLocation, latitude: "0" })
        ).not.toThrow("Latitude is out of range");
      });
    });
    describe("Longitude validation", () => {
      test("should fail if longitude is not provided", () => {
        expect(() =>
          generateSiweMsg({ ...singleLocation, longitude: "" })
        ).toThrow("Longitude is required");
      });
      test("should fail if longitude is not valid", () => {
        expect(() =>
          generateSiweMsg({ ...singleLocation, longitude: "test" })
        ).toThrow("Longitude is invalid");
      });
      test("should fail if longitude is not in range", () => {
        expect(() =>
          generateSiweMsg({ ...singleLocation, longitude: "180.00000001" })
        ).toThrow("Longitude is out of range");
        expect(() =>
          generateSiweMsg({ ...singleLocation, longitude: "-180.00000001" })
        ).toThrow("Longitude is out of range");
      });
      test("should not fail if longitude is in range", () => {
        expect(() =>
          generateSiweMsg({ ...singleLocation, longitude: "180.0" })
        ).not.toThrow("Longitude is out of range");
        expect(() =>
          generateSiweMsg({ ...singleLocation, longitude: "123" })
        ).not.toThrow("Longitude is out of range");
        expect(() =>
          generateSiweMsg({ ...singleLocation, longitude: "-180.000" })
        ).not.toThrow("Longitude is out of range");
        expect(() =>
          generateSiweMsg({ ...singleLocation, longitude: "47.1231231" })
        ).not.toThrow("Longitude is out of range");
        expect(() =>
          generateSiweMsg({ ...singleLocation, longitude: "0" })
        ).not.toThrow("Longitude is out of range");
      });
    });
    describe("Distance validation", () => {
      test("should fail if distance is not provided", () => {
        expect(() =>
          generateSiweMsg({ ...singleLocation, distance: "" })
        ).toThrow("Distance is required");
      });
      test("should fail if distance is not valid", () => {
        expect(() =>
          generateSiweMsg({ ...singleLocation, distance: "test" })
        ).toThrow("Distance is invalid");
      });
      test("should fail if distance is not in range", () => {
        expect(() =>
          generateSiweMsg({ ...singleLocation, distance: "-0.01" })
        ).toThrow("Distance is out of range");
        expect(() =>
          generateSiweMsg({ ...singleLocation, distance: "-1" })
        ).toThrow("Distance is out of range");
      });
      test("should not fail if distance is in range", () => {
        expect(() =>
          generateSiweMsg({ ...singleLocation, distance: "0" })
        ).not.toThrow("Distance is out of range");
        expect(() =>
          generateSiweMsg({ ...singleLocation, distance: "0.01" })
        ).not.toThrow("Distance is out of range");
        expect(() =>
          generateSiweMsg({ ...singleLocation, distance: "1" })
        ).not.toThrow("Distance is out of range");
        expect(() =>
          generateSiweMsg({ ...singleLocation, distance: "1.01" })
        ).not.toThrow("Distance is out of range");
        expect(() =>
          generateSiweMsg({ ...singleLocation, distance: "100" })
        ).not.toThrow("Distance is out of range");
      });
    });
    describe("Time validation", () => {
      test("should fail if from is not provided", () => {
        expect(() => generateSiweMsg({ ...singleLocation, from: "" })).toThrow(
          "From is required"
        );
      });
      test("should fail if to is not provided", () => {
        expect(() => generateSiweMsg({ ...singleLocation, to: "" })).toThrow(
          "To is required"
        );
      });
      test("should fail if from is not valid", () => {
        expect(() =>
          generateSiweMsg({ ...singleLocation, from: "test" })
        ).toThrow("From is invalid");
      });
      test("should fail if to is not valid", () => {
        expect(() =>
          generateSiweMsg({ ...singleLocation, to: "test" })
        ).toThrow("To is invalid");
      })
      test("should fail if from is not in range", () => {
        expect(() =>
          generateSiweMsg({ ...singleLocation, from: "-1" })
        ).toThrow("From is out of range");
      })
      test("should fail if to is not in range", () => {
        expect(() =>
          generateSiweMsg({ ...singleLocation, to: "-1" })
        ).toThrow("To is out of range");
      })
      test("should fail is from is greater than to", () => {
        expect(() =>
          generateSiweMsg({ ...singleLocation, from: "2", to: "1" })
        ).toThrow("From is greater than To");
      })
    });
  });
});
