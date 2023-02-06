import { SiweMessage } from "siwe";
import { formatDate, scaleCoordinatesDown } from "./helpers";
import { LocationSiweProps, ParsedLocationSiweProps } from "./types";

const TESTNET_CHAIN_ID = 4690;

const generateSiweMsg = (props: LocationSiweProps): string => {
  validateProps(props);
  const parsedProps = parseProps(props);

  const message = new SiweMessage({
    domain: props.domain,
    address: props.address,
    statement: generateStatement(parsedProps),
    uri: props.uri,
    version: "1",
    chainId: TESTNET_CHAIN_ID,
    expirationTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  });
  return message.prepareMessage();
};

export default generateSiweMsg;

const validateProps = (props: LocationSiweProps) => {
  const { domain, uri, address, latitude, longitude, distance, from, to } =
    props;

  if (!domain) throw new Error("Domain is required");
  if (!uri) throw new Error("URI is required");

  validateAddress(address);
  validateLatitude(latitude);
  validateLongitude(longitude);
  validateDistance(distance);
  validateTime(from, to);
};

const validateAddress = (address: string) => {
  if (!address) throw new Error("Address is required");
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address))
    throw new Error("Address is invalid");
  if (address === "0x0000000000000000000000000000000000000000")
    throw new Error("Zero address is invalid");
};

const validateLatitude = (latitude: string) => {
  if (!latitude) throw new Error("Latitude is required");
  if (Number.isNaN(Number(latitude))) throw new Error("Latitude is invalid");
  if (Number(latitude) < -90 || Number(latitude) > 90)
    throw new Error("Latitude is out of range");
};

const validateLongitude = (longitude: string) => {
  if (!longitude) throw new Error("Longitude is required");
  if (Number.isNaN(Number(longitude))) throw new Error("Longitude is invalid");
  if (Number(longitude) < -180 || Number(longitude) > 180)
    throw new Error("Longitude is out of range");
};

const validateDistance = (distance: string) => {
  if (!distance) throw new Error("Distance is required");
  if (Number.isNaN(Number(distance))) throw new Error("Distance is invalid");
  if (Number(distance) < 0) throw new Error("Distance is out of range");
};

const validateTime = (from: string, to: string) => {
  if (!from) throw new Error("From is required");
  if (!to) throw new Error("To is required");
  if (Number.isNaN(Number(from))) throw new Error("From is invalid");
  if (Number.isNaN(Number(to))) throw new Error("To is invalid");
  if (Number(from) < 0) throw new Error("From is out of range");
  if (Number(to) < 0) throw new Error("To is out of range");
  if (Number(from) > Number(to)) throw new Error("From is greater than To");
};

const parseProps = (props: LocationSiweProps) => {
  const { latitude, longitude, distance, from, to } = props;
  return {
    latitude: scaleCoordinatesDown(Number(latitude)),
    longitude: scaleCoordinatesDown(Number(longitude)),
    distance: Number(distance),
    from: formatDate(Number(from)),
    to: formatDate(Number(to)),
  };
};

const generateStatement = ({
  latitude,
  longitude,
  distance,
  from,
  to,
}: ParsedLocationSiweProps) =>
  `The application will know if you were located in the following region with latitude: ${latitude}, longitude: ${longitude}, and within a maximum distance of ${distance} meters, between ${from}, and ${to}`;
