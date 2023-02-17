# IoTeX Geo Location Package

This package allows to seamlessly interact with the IoTeX API for trusted geo location. 

This project contains 2 packages, [`generate-siwe`](https://github.com/machinefi/geolocation-sdk-demo/tree/main/packages/generate-siwe) and [`geolocation`](https://github.com/machinefi/geolocation-sdk-demo/tree/main/packages/geolocation)

The `generate-siwe` package is used to create a siwe message that will have to be signed by the user. Then, using the `geolocation` package, the application will be able to query the API to get a proof of the user's presence in a certain location area, within a time range. 

For more information, check out the full trusted location documentation, [here](https://iotex.gitbook.io/trustedlocation/overview/iotex-trusted-location-api). 
