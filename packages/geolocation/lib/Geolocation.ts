import {
  validateLatitude,
  validateLongitude,
  validateDistance,
  validateTime,
  generateSiweMsg,
  LocationArea,
  LocationTimestampMs,
  ScaledLocationArea,
  Location,
  LocationTimestampSeconds,
} from "@nick-iotex/generate-siwe";
import axios from "axios";
import { ScaledLocation, VerifiedLocation } from "./types";

class Geolocation {
  private _locationArea: LocationArea | null = null;
  private _time: LocationTimestampMs | null = null;

  constructor() {}

  /////////////////////////
  /////// GETTERS /////////
  /////////////////////////
  get location(): Location | null {
    if (!this._locationArea || !this._time) {
      return null;
    }
    return { ...this._locationArea, ...this._time };
  }

  get locationArea(): LocationArea | null {
    return this._locationArea;
  }

  get locationTime(): LocationTimestampMs | null {
    return this._time;
  }

  get scaledLocation(): ScaledLocation | null {
    if (!this.scaledLocationArea || !this.scaledLocationTime) {
      return null;
    }
    return {
      ...this.scaledLocationArea,
      ...this.scaledLocationTime,
    };
  }

  get scaledLocationArea(): ScaledLocationArea | null {
    if (!this.locationArea) {
      return null;
    }
    const { latitude, longitude, distance } = this.locationArea;
    return {
      scaled_latitude: Geolocation.scaleCoordinatesUp(latitude),
      scaled_longitude: Geolocation.scaleCoordinatesUp(longitude),
      distance,
    };
  }

  get scaledLocationTime(): LocationTimestampMs | null {
    if (!this.locationTime) {
      return null;
    }
    const { from, to } = this.locationTime;
    return {
      from: Geolocation.millisecondsToSeconds(from),
      to: Geolocation.millisecondsToSeconds(to),
    };
  }

  /////////////////////////
  /////// SETTERS /////////
  /////////////////////////
  set locationArea(locationArea: LocationArea) {
    Geolocation.validateLocationArea(locationArea);
    this._locationArea = locationArea;
  }

  set locationTime(time: LocationTimestampMs) {
    Geolocation.validateLocationTime(time);
    this._time = time;
  }

  set location(location: Location) {
    const { latitude, longitude, distance, from, to } = location;
    this.locationArea = { latitude, longitude, distance };
    this.locationTime = { from, to };
  }

  set scaledLocationArea(location: ScaledLocationArea) {
    const { scaled_latitude, scaled_longitude, distance } = location;
    this.locationArea = {
      latitude: Geolocation.scaleCoordinatesDown(scaled_latitude),
      longitude: Geolocation.scaleCoordinatesDown(scaled_longitude),
      distance,
    };
  }

  set scaledLocationTime(time: LocationTimestampSeconds) {
    const from = Geolocation.secondsToMilliseconds(time.from);
    const to = Geolocation.secondsToMilliseconds(time.to);

    this.locationTime = {
      from,
      to,
    };
  }

  set scaledLocation(location: ScaledLocation) {
    const { scaled_latitude, scaled_longitude, distance, from, to } = location;
    this.scaledLocationArea = {
      scaled_latitude,
      scaled_longitude,
      distance,
    };
    this.scaledLocationTime = {
      from,
      to,
    };
  }

  //////////////////////////
  //// STATIC FUNCTIONS ////
  //////////////////////////
  static validateLocationArea(locationArea: LocationArea) {
    const { latitude, longitude, distance } = locationArea;
    validateLatitude(latitude);
    validateLongitude(longitude);
    validateDistance(distance);
  }

  static validateLocationTime(time: LocationTimestampMs) {
    const { from, to } = time;
    validateTime(from, to);
  }

  static scaleCoordinatesDown(coordInput: number) {
    return Number(coordInput) / 1000_000;
  }

  static scaleCoordinatesUp(coordInput: number) {
    return Math.round(coordInput * 1000_000);
  }

  static millisecondsToSeconds(milliseconds: number): number {
    return Math.round(milliseconds / 1000);
  }

  static secondsToMilliseconds(seconds: number): number {
    return seconds * 1000;
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
      locations: [{ ...this.scaledLocationArea, ...this.scaledLocationTime }],
    };

    try {
      const response = await axios.post(
        this._isMainnet ? this._mainApi : this._testApi,
        body
      );

      if (response.status !== 200) {
        throw new Error(
          "Response status is not 200, check the console for details"
        );
      }

      return response.data?.result?.data?.length
        ? response.data.result.data
        : [];
    } catch (error) {
      console.log(`Querying GeoStream API failed with error: ${error}.`);
      throw new Error("Querying GeoStream API failed, see console for details");
    }
  }
}

export { Geolocation, GeolocationSiwe, GeolocationVerifier };
