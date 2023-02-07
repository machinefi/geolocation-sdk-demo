import {
  LocationArea,
  LocationISOTime,
  LocationTimestamp,
} from "./../../../types";
import { SiweMessage } from "siwe";

export type RawLocation = LocationTimestamp & LocationArea;

export type ParsedLocationSiweProps = LocationISOTime & LocationArea;

export type LocationSiweProps = RawLocation & Partial<SiweMessage>;
