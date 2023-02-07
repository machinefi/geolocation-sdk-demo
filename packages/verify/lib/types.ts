import {
  LocationISOTime,
  LocationTimestamp,
  ScaledLocationArea,
} from "./../../../types";

export type Location = ScaledLocationArea & LocationISOTime;

export type VerifiedLocation = ScaledLocationArea &
  LocationTimestamp & {
    devicehash: string;
    signature: string;
  };
