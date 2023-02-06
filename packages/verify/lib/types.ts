export type VerifiedLocation = {
    "scaled_latitude":  number, 
    "scaled_longitude":  number, 
    "distance": number, 
    "from": number, 
    "to": number, 
    "devicehash": string, 
    "signature": string, 
}

export type Location = {
    scaled_latitude: number,
    scaled_longitude: number,
    distance: number,
    from: string,
    to: string
}