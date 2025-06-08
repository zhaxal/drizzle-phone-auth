import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./database";
import { phoneNumber, admin, openAPI } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";

import * as schema from "@/db/auth-schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  appName: "drizzle-phone-auth",
  plugins: [
    openAPI(),
    admin(),
    phoneNumber({
      sendOTP: ({ phoneNumber, code }, request) => {
        console.log("Sending OTP to:", phoneNumber, "Code:", code);
      },
      signUpOnVerification: {
        getTempEmail: (phoneNumber) => {
          return `${phoneNumber}@my-site.com`;
        },
      },
    }),
    nextCookies(),
  ],
});
