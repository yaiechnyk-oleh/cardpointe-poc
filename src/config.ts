/**
 * CardPointe Gateway API Configuration
 * UAT Environment Credentials
 */

export const config = {
    // API Base URL (UAT Environment)
    apiBaseUrl: 'https://fts-uat.cardconnect.com/cardconnect/rest',

    // Authentication credentials
    username: 'testing',
    password: 'testing123',

    // Merchant ID
    merchantId: '800000050032',

    // iFrame Tokenizer URL (for frontend)
    tokenizerUrl: 'https://fts-uat.cardconnect.com/itoke/ajax-tokenizer.html',

    // Generate Base64 encoded auth header
    get authHeader(): string {
        const credentials = `${this.username}:${this.password}`;
        return `Basic ${Buffer.from(credentials).toString('base64')}`;
    }
};
