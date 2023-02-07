import axios from "axios";
import { Location, VerifiedLocation } from "./types";

const verifyLocation = async (
  locations: Location[],
  owner: string,
  signature: string,
  message: string | Uint8Array
): Promise<VerifiedLocation[]> => {
  // const body = {
  //   signature,
  //   message,
  //   owner,
  //   locations,
  // };

  // try {
  //   const response = await axios.post(geostreamEndpoint, body);
  //   return response.data.result.data;
  // } catch (error) {
  //   console.log(`Querying GeoStream API failed with error: ${error}.`);
  // }
  // return [];
};

export default verifyLocation;
