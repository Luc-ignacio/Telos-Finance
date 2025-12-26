import { Brapi } from "brapi";

const brapi = new Brapi({
  apiKey: process.env.BRAPI_API_KEY,
});

export default brapi;
