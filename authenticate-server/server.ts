require("dotenv").config();
import Fastify, { FastifyInstance, FastifyRequest } from "fastify";
import formbody from "@fastify/formbody";
import cors from "@fastify/cors";

import {
  SkyMavisOAuth2Client,
  type GetTokenParams,
} from "../skymavis-oauth2-client/lib";

const client = new SkyMavisOAuth2Client({
  clientId: process.env.CLIENT_ID as string,
});

const server: FastifyInstance = Fastify({});
server.register(formbody);
server.register(cors, {
  methods: ["GET", "PUT", "POST"],
  origin: "*",
  allowedHeaders: ["Content-Type", "Authorization"],
});

type ClientCredentials = {
  code: string;
  codeVerifier: string;
  redirectUri?: string;
};

server.post(
  "/oauth2/token",
  async (request: FastifyRequest<{ Body: ClientCredentials }>, reply) => {
    try {
      const body = request.body || {};

      if (!body.code) {
        throw new Error("Missing code");
      }

      body.redirectUri ||= process.env.CALLBACK_URL;

      const params = {
        ...body,
        clientSecret: process.env.CLIENT_SECRET,
        apiKey: process.env.API_KEY,
      } as GetTokenParams;

      return client.authorizationCode.getToken(params);
    } catch (error) {
      console.error(error);
    }
  }
);

server.get("/oauth2/userinfo", async (request, reply) => {
  try {
    const accessToken = request.headers["authorization"] as string;
    const user = await client.account.getUserInfo({
      accessToken,
      apiKey: process.env.API_KEY as string,
    });
    return user;
  } catch (error) {
    console.error(error);
  }
});

const start = async () => {
  try {
    const PORT = 8080;
    await server.listen({ port: PORT });

    const address = server.server.address();
    const port = typeof address === "string" ? address : address?.port;
    console.log("Server is running on port", PORT);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
