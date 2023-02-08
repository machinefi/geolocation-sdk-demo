import {
  LocationISOTime,
  LocationTimestamp,
  ScaledLocationArea,
} from "@nicky-ru/generate-siwe";

export type Location = ScaledLocationArea & LocationISOTime;

export type VerifiedLocation = ScaledLocationArea &
  LocationTimestamp & {
    devicehash: string;
    signature: string;
  };
