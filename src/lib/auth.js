import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGO_DB_URI);
const db = client.db('ticket-bari');

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  database: mongodbAdapter(db, {
    client,
  }),

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "passenger",
      },
    },
  },
});