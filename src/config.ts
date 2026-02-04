/**
 * CardPointe Gateway API Configuration
 * Reads from environment variables (.env file)
 */

import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
    'CARDPOINTE_API_URL',
    'CARDPOINTE_USERNAME',
    'CARDPOINTE_PASSWORD',
    'CARDPOINTE_MERCHANT_ID',
    'CARDPOINTE_TOKENIZER_URL',
] as const;

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

export const config = {
    // API Base URL
    apiBaseUrl: process.env.CARDPOINTE_API_URL!,

    // Authentication credentials
    username: process.env.CARDPOINTE_USERNAME!,
    password: process.env.CARDPOINTE_PASSWORD!,

    // Merchant ID
    merchantId: process.env.CARDPOINTE_MERCHANT_ID!,

    // iFrame Tokenizer URL (for frontend)
    tokenizerUrl: process.env.CARDPOINTE_TOKENIZER_URL!,

    // Generate Base64 encoded auth header
    get authHeader(): string {
        const credentials = `${this.username}:${this.password}`;
        return `Basic ${Buffer.from(credentials).toString('base64')}`;
    }
};
