import * as dotenv from "dotenv";

dotenv.config();

export const ENV = {
    API_URL: process.env.API_URL || 'http://localhost:3000'
}