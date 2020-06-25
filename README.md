## Instructions

You can run this project locally on your terminal. Install all packages required with `npm install`. Afterwards, run `npm run-script build` to build the React client code. Once that's done, run `node server/start.js` to spin up the application and visit http://localhost:8080 on any browser to utilize it.

This application obtains initial line data from the MBTA's API, so an API KEY is encouraged. While you can make requests without one, the requests are severly rate restricted. If you choose to use your own api key, make sure you save it within an .env file on the root level of this project. The application will use dotenv to configure env variables if its running in a local environment.