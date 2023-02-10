## Install

Run `npm i @nick-iotex/g3o`

## HIW

Instantiate a new instance of a geolocation, like this: `const geolocation = new GeolocationVerifier()`. This constructor doesn't take any parameters for testnet. 

In order to call the mainnet API you'll need to specify it like this: `new GeolocationVerifier({isMainnet: true})`. 

In order to generate a Siwe message, you'll have to first create a location, like this: 

```typescript
 geolocation.location = ({latitude: 47.658872, longitude: -27.4444, distance:1000, from: timestampMs, to: timestampMs})
 ```
 
Or for scaled coordinates (e.g. latitude: 47658872, etc...) you can set a `scaledLocationArea` like this: 

```typescript

// sets location area

geolocation.scaledLocationArea = {
    scaled_latitude: number,
    scaled_longitude: number,
    distance: number
    }

```

And set the location time in milliseconds like this: 

```typescript

// sets location time

geolocation.locationTime = {
    from: number,
    to: number
    }

```

These values will be validated under the hood, and will be used in the `generateSiweMessage()` method: 


```typescript

// generates Siwe message and returns it as a string

geolocation.generateSiweMessage({
    domain: string,
    uri: string,
    address: string,
    })

```

You can now use any library of choice to sign this message and retrieve its signature. 

You can now set the signature you just retrieved like this: 

```typescript

// sets the signature

geolocation.signature = { signature: string } 

```

You're now ready to call the `verifyLocation()` method which will not need any params. 

## Get Started

For a quick example of how this package works, check out this step-by-step *get-started* on the [iotex developers portal]()
