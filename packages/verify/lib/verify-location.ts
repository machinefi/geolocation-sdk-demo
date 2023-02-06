import { Location, VerifiedLocation } from "./types";

const GEOSTREAM_API = "https://geo-test.w3bstream.com/api/pol";

const getLocationProof = async (
  locations: Location[],
  owner: string,
  signature: string,
  message: string | Uint8Array
): Promise<VerifiedLocation[] | undefined> => {
  const body = {
    signature,
    message,
    owner,
    locations,
  };

  try {
    const response = await fetch(GEOSTREAM_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.log("Error getting location proof");
      return;
    }
    const data = await response.json();
    return data.result.data;
  } catch (error) {
    console.log(error);
  }
};

export default getLocationProof;
