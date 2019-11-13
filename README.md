# PlacePod Api Client

A node.js client application for talking to the PlacePod API.

The swagger page for this API is currently located here:

http://placepod-api-swagger-dev.s3-website-us-west-1.amazonaws.com

## Usage

Your system should have Node v10 or higher installed.

The following environment variables are required to test this client:

- API_URL: The base address of the PlacePod API. Ex: 'https://api-dev.placepod.com'.

- API_KEY: 'Your API token for accessing secured resources. Ex '123456'.

Once these values are exported, then you can run the default test application by
entering the following commands:

```sh
# Install required modules.
npm i

# Start the client.
npm start
```

The shell script `run.sh` shows one way to set environment variables and start the client. This assumes you
created a file in the root directory called `.env`, for example:

```
API_URL=https://api-dev.placepod.com
API_KEY=123456
```

