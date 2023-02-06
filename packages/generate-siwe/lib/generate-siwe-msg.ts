import { SiweMessage } from "siwe";
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
    expirationTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes from now
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

const validateLatitude = (latitude: number) => {
  if (latitude < -90 || latitude > 90)
    throw new Error("Latitude is out of range");
};

const validateLongitude = (longitude: number) => {
  if (longitude < -180 || longitude > 180)
    throw new Error("Longitude is out of range");
};

const validateDistance = (distance: number) => {
  if (distance <= 0) throw new Error("Distance is out of range");
};

const validateTime = (from: number, to: number) => {
  if (from < 0) throw new Error("From is out of range");
  if (to < 0) throw new Error("To is out of range");
  if (from >= to) throw new Error("From is greater or equals To");
};

const parseProps = (props: LocationSiweProps) => ({
  ...props,
  from: new Date(props.from).toLocaleDateString(),
  to: new Date(props.to).toLocaleDateString(),
});

const generateStatement = ({
  latitude,
  longitude,
  distance,
  from,
  to,
}: ParsedLocationSiweProps) =>
  `The application will know if you were located in the following region with latitude: ${latitude}, longitude: ${longitude}, and within a maximum distance of ${distance} meters, between ${from}, and ${to}`;
