## Install

Run `npm i @nick-iotex/g3o`

## HIW

Instantiate a new instance of the geolocation package, like this: `new GeolocationVerifier()`. This constructor doesn't take any parameters for testnet. 

In order to call the mainnet API you'll need to speciify it like this: `new GeolocationVerifier(true)`. 

In order to generate a Siwe message, you'll have to first set a `scaledLocationArea` and a `locationTime`:

```typescript

// sets location area

scaledLocationArea(
    scaled_latitude: number,
    scaled_longitude: number,
    distance: number
    )

```

```typescript

// sets location time

locationTime(
    from: number,
    to: number
    )

```

These values will be validated under the hood, and will be used in the `generateSiweMessage()` method: 


```typescript

// generates Siwe message and returns it as a string

generateSiweMessage(
    domain: string,
    uri: string,
    address: string,
    )

```

You can now use any library of choice to sign this message and retrieve its signature. 

Use the `signature()` method to pass the signature you just retrieved: 

```typescript

// sets the signature

signature(
    signature: string
    )

```

You're now ready to call the `verifyLocation()` method which will not need any params. 
