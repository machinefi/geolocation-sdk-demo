import {
  LocationArea,
  LocationTimestamp,
  ScaledLocationArea,
} from "../../../types";
import {
  validateLatitude,
  validateLongitude,
  validateDistance,
  validateTime,
  generateSiweMsg,
} from "@geostream-react/generate-siwe";

// step1 - init geolocation (mainnet or testnet)
// const geolocation = new Geolocation({ isMainnet: true });

// step2 - provide location
// geolocation.location = {
//   latitude: 50.4501,
//   longitude: 30.5234,
//   distance: 100,
//   from: 1610000000,
//   to: 1610000000,
// };

// step3 - generate message to sign
// const message = geolocation.generateMessage({
//   domain: "https://example.com",
//   uri: "https://example.com",
//   address: "0x0000000000000000000000000000000000000000",
// });

// step4 - sign message
// step5 - add signature
// step6 - verify location

type RawLocation = LocationTimestamp & LocationArea;

class Geolocation {
  private _testApi: string = "https://geo-test.w3bstream.com/api/pol";
  private _mainApi: string = "https://geo.w3bstream.com/api/pol";
  private _isMainnet: boolean = false;
  private _locationArea: LocationArea | null = null;
  private _time: LocationTimestamp | null = null;

  constructor(options?: { isMainnet?: boolean }) {
    if (options?.isMainnet) {
      this._isMainnet = true;
    }
  }

  get location(): RawLocation | null {
    return { ...this._locationArea, ...this._time };
  }

  get locationArea(): LocationArea | null {
    return this._locationArea;
  }

  get locationTime(): LocationTimestamp | null {
    return this._time;
  }

  set locationArea(locationArea: LocationArea) {
    Geolocation.validateLocationArea(locationArea);
    this._locationArea = locationArea;
  }

  set locationTime(time: LocationTimestamp) {
    Geolocation.validateLocationTime(time);
    this._time = time;
  }

  set location(location: RawLocation) {
    const { latitude, longitude, distance, from, to } = location;
    this.locationArea = { latitude, longitude, distance };
    this.locationTime = { from, to };
  }

  static validateLocationArea(locationArea: LocationArea) {
    const { latitude, longitude, distance } = locationArea;
    validateLatitude(latitude);
    validateLongitude(longitude);
    validateDistance(distance);
  }

  static validateLocationTime(time: LocationTimestamp) {
    const { from, to } = time;
    validateTime(from, to);
  }
}

class ScaledGeolocation extends Geolocation {
  get scaledLocation(): ScaledLocationArea {
    const { latitude, longitude, distance } = this.locationArea;
    return {
      scaled_latitude: ScaledGeolocation.scaleCoordinatesUp(latitude),
      scaled_longitude: ScaledGeolocation.scaleCoordinatesUp(longitude),
      distance,
    };
  }

  set scaledLocation(location: ScaledLocationArea) {
    const { scaled_latitude, scaled_longitude, distance } = location;
    this.locationArea = {
      latitude: ScaledGeolocation.scaleCoordinatesDown(scaled_latitude),
      longitude: ScaledGeolocation.scaleCoordinatesDown(scaled_longitude),
      distance,
    };
  }

  async verifyLocation() {
    // const body = {
    //   signature,
    //   message,
    //   owner,
    //   locations,
    // };
    // try {
    //   const response = await axios.post(geostreamEndpoint, body);
    //   return response.data.result.data;
    // } catch (error) {
    //   console.log(`Querying GeoStream API failed with error: ${error}.`);
    // }
    // return [];
  }

  static scaleCoordinatesDown(coordInput: number) {
    return Number(coordInput) / Math.pow(10, 6);
  }

  static scaleCoordinatesUp(coordInput: number) {
    return Math.round(coordInput * Math.pow(10, 6));
  }
}

class GeolocationSiwe extends Geolocation {
  generateSiweMessage(props: {
    domain: string;
    uri: string;
    address: string;
  }): string {
    return generateSiweMsg({
      ...this.locationArea,
      ...this.locationTime,
      ...props,
    });
  }
}

export { Geolocation, ScaledGeolocation, GeolocationSiwe };
