export interface L3LineItem {
    lineno: string;          // Line item number
    description: string;     // Item description
    quantity: string;        // Quantity
    uom: string;             // Unit of measure (e.g., "each", "ton")
    unitcost: string;        // Cost per unit
    netamnt: string;         // Net amount (quantity * unitcost)
    taxamnt: string;         // Tax amount for this line item
    discamnt?: string;       // Discount amount (optional)
    upc?: string;            // Universal Product Code (optional)
}

export interface AuthorizationRequest {
    // Required fields
    merchid: string;         // Merchant ID
    amount: string;          // Transaction amount in dollars (e.g., "25.00")

    // Card data (use one of these)
    account?: string;        // Card number or token
    expiry?: string;         // Card expiration (MMYY format)
    cvv2?: string;           // CVV code

    // Transaction options
    currency?: string;       // Currency code (default: USD)
    capture?: string;        // "Y" to capture immediately, "N" for auth only
    orderid?: string;        // Merchant order ID

    // Level 2 Data
    ponumber?: string;       // Purchase order number
    taxamnt?: string;        // Total tax amount

    // Level 3 Data
    shiptozip?: string;      // Shipping destination ZIP code
    orderdate?: string;      // Order date (YYYYMMDD format)
    items?: L3LineItem[];    // Line items array

    // Additional fields
    name?: string;           // Cardholder name
    address?: string;        // Billing address
    city?: string;           // Billing city
    region?: string;         // Billing state/region
    postal?: string;         // Billing postal code
    country?: string;        // Billing country
    email?: string;          // Customer email
    phone?: string;          // Customer phone
}

export interface AuthorizationResponse {
    respstat: 'A' | 'B' | 'C';  // A=Approved, B=Retry, C=Declined
    respcode: string;            // Response code
    resptext: string;            // Response text/message
    respproc: string;            // Response processor
    retref: string;              // Transaction reference number
    account: string;             // Masked account number
    token: string;               // CardSecure token
    amount: string;              // Authorized amount
    merchid: string;             // Merchant ID
    authcode?: string;           // Authorization code (if approved)
    cvvresp?: string;            // CVV response
    avsresp?: string;            // AVS response
    commcard?: string;           // Commercial card indicator
    emvresp?: string;            // EMV response data
}

export interface CaptureRequest {
    merchid: string;
    retref: string;
    amount?: string;
}

export interface CaptureResponse {
    respstat: 'A' | 'B' | 'C';
    respcode: string;
    resptext: string;
    retref: string;
    amount: string;
    merchid: string;
    setlstat: string;
}

export interface VoidRequest {
    merchid: string;
    retref: string;
}

export interface VoidResponse {
    respstat: 'A' | 'B' | 'C';
    respcode: string;
    resptext: string;
    retref: string;
    amount: string;
    merchid: string;
    authcode: string;
}

export interface InquireResponse {
    respstat: 'A' | 'B' | 'C';
    respcode: string;
    resptext: string;
    retref: string;
    account: string;
    amount: string;
    merchid: string;
    setlstat: string;
    capturedate?: string;
    voidable?: string;
    refundable?: string;
}
