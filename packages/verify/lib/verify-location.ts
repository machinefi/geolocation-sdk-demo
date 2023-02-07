import axios from "axios";
import { Location, VerifiedLocation } from "./types";

class Geolocation {
  private geostreamEndpoint: string;

  constructor(geostreamEndpoint: string) {
    this.geostreamEndpoint = geostreamEndpoint;
  }

  async verifyLocation(
    locations: Location[],
    owner: string,
    signature: string,
    message: string | Uint8Array
  ): Promise<VerifiedLocation[]> {
    const body = {
      signature,
      message,
      owner,
      locations,
    };

    try {
      const response = await axios.post(this.geostreamEndpoint, body);
      return response.data.result.data;
    } catch (error) {
      console.log(`Querying GeoStream API failed with error: ${error}.`);
    }
    return [];
  }
}

export default Geolocation;
