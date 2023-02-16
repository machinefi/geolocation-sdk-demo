import {
  LocationISOTime,
  LocationTimestampMs,
  ScaledLocationArea,
  LocationTimestampSeconds,
} from "@w3bstream/generate-siwe";

export type ScaledLocation = ScaledLocationArea & LocationTimestampSeconds;
export type LocationToSign = ScaledLocationArea & LocationISOTime;

export type VerifiedLocation = ScaledLocationArea &
  LocationTimestampMs & {
    devicehash: string;
    signature: string;
  };
