import {
  validateLatitude,
  validateLongitude,
  validateDistance,
  validateTime,
  generateSiweMsg,
  LocationArea,
  LocationTimestamp,
  ScaledLocationArea,
} from "@nicky-ru/generate-siwe";
import axios from "axios";
import { VerifiedLocation } from "./types";

type RawLocation = LocationTimestamp & LocationArea;

class Geolocation {
  private _locationArea: LocationArea | null = null;
  private _time: LocationTimestamp | null = null;

  constructor() {}

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

  get scaledLocationArea(): ScaledLocationArea {
    const { latitude, longitude, distance } = this.locationArea;
    return {
      scaled_latitude: Geolocation.scaleCoordinatesUp(latitude),
      scaled_longitude: Geolocation.scaleCoordinatesUp(longitude),
      distance,
    };
  }

  set scaledLocationArea(location: ScaledLocationArea) {
    const { scaled_latitude, scaled_longitude, distance } = location;
    this.locationArea = {
      latitude: Geolocation.scaleCoordinatesDown(scaled_latitude),
      longitude: Geolocation.scaleCoordinatesDown(scaled_longitude),
      distance,
    };
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

  static scaleCoordinatesDown(coordInput: number) {
    return Number(coordInput) / Math.pow(10, 6);
  }

  static scaleCoordinatesUp(coordInput: number) {
    return Math.round(coordInput * Math.pow(10, 6));
  }
}

class GeolocationSiwe extends Geolocation {
  private _signature: string | null = null;
  private _message: string | null = null;
  private _owner: string | null = null;

  get signature(): string | null {
    return this._signature;
  }

  get message(): string | null {
    return this._message;
  }

  get owner(): string | null {
    return this._owner;
  }

  set signature(signature: string | null) {
    this._signature = signature;
  }

  generateSiweMessage(props: {
    domain: string;
    uri: string;
    address: string;
  }): string {
    if (!this.locationArea || !this.locationTime) {
      throw new Error("Missing location area or time");
    }
    const msg = generateSiweMsg({
      ...this.locationArea,
      ...this.locationTime,
      ...props,
    });
    this._message = msg;
    this._owner = props.address;
    return msg;
  }
}

class GeolocationVerifier extends GeolocationSiwe {
  private _testApi: string = "https://geo-test.w3bstream.com/api/pol";
  private _mainApi: string = "https://geo.w3bstream.com/api/pol";
  private _isMainnet: boolean = false;

  constructor(options?: { isMainnet?: boolean }) {
    super();
    if (options?.isMainnet) {
      this._isMainnet = true;
    }
  }

  async verifyLocation(): Promise<VerifiedLocation[]> {
    if (!this.locationArea || !this.locationTime) {
      throw new Error("Missing location area or time");
    }
    if (!this.signature || !this.message || !this.owner) {
      throw new Error("Missing location signature, message or owner");
    }
    const body = {
      signature: this.signature,
      message: this.message,
      owner: this.owner,
      locations: [{ ...this.scaledLocationArea, ...this.locationTime }],
    };

    try {
      const response = await axios.post(
        this._isMainnet ? this._mainApi : this._testApi,
        body
      );

      if (response.status !== 200) {
        throw new Error("Querying GeoStream API failed");
      }

      return response.data.result.data;
    } catch (error) {
      console.log(`Querying GeoStream API failed with error: ${error}.`);
    }
    return [];
  }
}

export { Geolocation, GeolocationSiwe, GeolocationVerifier };
