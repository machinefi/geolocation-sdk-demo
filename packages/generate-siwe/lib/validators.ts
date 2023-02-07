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

export {
  validateAddress,
  validateLatitude,
  validateLongitude,
  validateDistance,
  validateTime,
};
