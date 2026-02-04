import fetch from 'node-fetch';
import { config } from './config';
import {
    AuthorizationRequest,
    AuthorizationResponse,
    CaptureRequest,
    CaptureResponse,
    VoidRequest,
    VoidResponse,
    InquireResponse,
} from './types';

export class CardPointeClient {
    private baseUrl: string;
    private authHeader: string;
    private merchantId: string;

    constructor() {
        this.baseUrl = config.apiBaseUrl;
        this.authHeader = config.authHeader;
        this.merchantId = config.merchantId;
    }

    /**
     * Make an API request to CardPointe Gateway
     */
    private async request<T>(
        endpoint: string,
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
        body?: object
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        console.log(`\n📡 API Request: ${method} ${url}`);
        if (body) {
            console.log('📦 Request Body:', JSON.stringify(body, null, 2));
        }

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.authHeader,
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        const responseText = await response.text();
        console.log(`Response Status: ${response.status}`);
        console.log('Response Body:', responseText);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${responseText}`);
        }

        return JSON.parse(responseText) as T;
    }

    /**
     * Authorization - Authorize a payment transaction
     * Includes support for L2/L3 data fields
     */
    async authorize(request: Omit<AuthorizationRequest, 'merchid'>): Promise<AuthorizationResponse> {
        const fullRequest: AuthorizationRequest = {
            merchid: this.merchantId,
            ...request,
        };

        return this.request<AuthorizationResponse>('/auth', 'PUT', fullRequest);
    }

    /**
     * Capture - Capture a previously authorized transaction
     */
    async capture(retref: string, amount?: string): Promise<CaptureResponse> {
        const request: CaptureRequest = {
            merchid: this.merchantId,
            retref,
            ...(amount && { amount }),
        };

        return this.request<CaptureResponse>('/capture', 'PUT', request);
    }

    /**
     * Void - Void a transaction before settlement
     */
    async void(retref: string): Promise<VoidResponse> {
        const request: VoidRequest = {
            merchid: this.merchantId,
            retref,
        };

        return this.request<VoidResponse>('/void', 'PUT', request);
    }

    /**
     * Inquire - Get transaction status
     */
    async inquire(retref: string): Promise<InquireResponse> {
        return this.request<InquireResponse>(`/inquire/${retref}/${this.merchantId}`, 'GET');
    }

    /**
     * Get Merchant ID
     */
    getMerchantId(): string {
        return this.merchantId;
    }
}
