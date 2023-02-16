## Install

Run `npm i @w3bstream/geolocation-light`

## HIW

Instantiate a new instance of a geolocation, like this: `const geolocation = new GeolocationVerifier()`. This constructor doesn't take any parameters for testnet. 

In order to call the mainnet API you'll need to specify it like this: `new GeolocationVerifier({isMainnet: true})`. 

In order to generate a Siwe message, you'll have to first create a location, like this: 

```typescript
geolocation.location = { 
    latitude: 47.658872,    // range [-90, 90]
    longitude: -27.4444,    // range [-180, 180]
    distance: 1000,         // range [0, infinity), meters
    from: 1676305034021,    // timestamp, unix milliseconds
    to: 1676305034488       // timestamp, unix milliseconds
    }
 ```
 
Or for scaled coordinates (e.g. latitude: 47658872, etc...) you can set a `scaledLocationArea` like this: 

```typescript
// sets location area
geolocation.scaledLocation = {
    scaled_latitude: -45500000,
    scaled_longitude: 123000000,
    distance: 100,
    from: 1676305034,   // timestamp, unix seconds
    to: 1676305035      // timestamp, unix seconds
    }
```

These values will be validated under the hood, and will be used in the `generateSiweMessage()` method: 


```typescript
// generates Siwe message and returns it as a string
const msg = geolocation.generateSiweMessage({
    domain: string,
    uri: string,
    address: string,
    })
```

You can now use any library of choice to sign this message and retrieve its signature. 

You can now set the signature you just retrieved like this: 

```typescript
// sets the signature
geolocation.signature = signature
```

You're now ready to call the `verifyLocation()` method which will not need any params. 

```typescript
const verifiedLocation = await geolocation.verifyLocation();
```

## Get Started

For a quick example of how this package works, check out this step-by-step *get-started* on the [iotex developers portal]()
