import { SiweMessage } from "siwe";
import { LocationSiweProps, ParsedLocationSiweProps } from "./types";
import {
  validateAddress,
  validateDistance,
  validateLatitude,
  validateLongitude,
  validateTime,
} from "./validators";

const TESTNET_CHAIN_ID = 4690;

export const generateSiweMsg = (props: LocationSiweProps): string => {
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
