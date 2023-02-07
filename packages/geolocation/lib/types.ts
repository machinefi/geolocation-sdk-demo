import {
  LocationISOTime,
  LocationTimestamp,
  ScaledLocationArea,
} from "@g3o/generate-siwe";

export type Location = ScaledLocationArea & LocationISOTime;

export type VerifiedLocation = ScaledLocationArea &
  LocationTimestamp & {
    devicehash: string;
    signature: string;
  };
