/**
 * CardPointe Gateway API Demo Script
 * 
 * This script demonstrates:
 * 1. Authorizing a payment with L2/L3 data
 * 2. Capturing the authorized transaction
 * 3. Inquiring about transaction status
 * 
 * Run with: npm run demo
 */

import { CardPointeClient } from './client';
import { L3LineItem } from './types';

async function runDemo() {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('   CardPointe Gateway API - L2/L3 Transaction Demo');
    console.log('═══════════════════════════════════════════════════════════════');

    const client = new CardPointeClient();

    // ═══════════════════════════════════════════════════════════════
    // STEP 1: Create L3 Line Items
    // ═══════════════════════════════════════════════════════════════
    console.log('\nSTEP 1: Preparing L3 Line Items...\n');

    const lineItems: L3LineItem[] = [
        {
            lineno: '1',
            description: 'Premium Widget',
            quantity: '2',
            uom: 'each',
            unitcost: '10.00',
            netamnt: '20.00',
            taxamnt: '1.80',
            discamnt: '0.00',
        },
        {
            lineno: '2',
            description: 'Deluxe Gadget',
            quantity: '1',
            uom: 'each',
            unitcost: '15.00',
            netamnt: '15.00',
            taxamnt: '1.35',
            discamnt: '0.00',
        },
    ];

    console.log('Line Items:');
    lineItems.forEach(item => {
        console.log(`  - ${item.description}: ${item.quantity} x $${item.unitcost} = $${item.netamnt} (tax: $${item.taxamnt})`);
    });

    // Calculate totals
    const subtotal = lineItems.reduce((sum, item) => sum + parseFloat(item.netamnt), 0);
    const totalTax = lineItems.reduce((sum, item) => sum + parseFloat(item.taxamnt), 0);
    const grandTotal = subtotal + totalTax;

    console.log(`\n  Subtotal: $${subtotal.toFixed(2)}`);
    console.log(`  Tax:      $${totalTax.toFixed(2)}`);
    console.log(`  ─────────────────`);
    console.log(`  Total:    $${grandTotal.toFixed(2)}`);

    // ═══════════════════════════════════════════════════════════════
    // STEP 2: Authorization with L2/L3 Data
    // ═══════════════════════════════════════════════════════════════
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('STEP 2: Authorizing Payment with L2/L3 Data...');
    console.log('═══════════════════════════════════════════════════════════════');

    try {
        const authResponse = await client.authorize({
            // Transaction amount
            amount: grandTotal.toFixed(2),

            // Test card credentials (Visa test card)
            account: '4111111111111111',
            expiry: '1227',
            cvv2: '123',

            // Capture setting: "Y" = auth + capture, "N" = auth only
            capture: 'Y',

            // Order identification
            orderid: `ORDER-${Date.now()}`,

            // Level 2 Data
            ponumber: 'PO-2026-00123',
            taxamnt: totalTax.toFixed(2),

            // Level 3 Data
            shiptozip: '19106',
            orderdate: '20260203',
            items: lineItems,

            // Billing information
            name: 'Test Customer',
            address: '123 Test Street',
            city: 'Philadelphia',
            region: 'PA',
            postal: '19106',
            country: 'US',
            email: 'test@example.com',
            phone: '5551234567',
        });

        console.log('\nAuthorization Result:');
        console.log('─────────────────────────────────────────────────────────────');
        console.log(`  Status:           ${authResponse.respstat === 'A' ? '✅ APPROVED' : '❌ ' + authResponse.respstat}`);
        console.log(`  Response Code:    ${authResponse.respcode}`);
        console.log(`  Response Text:    ${authResponse.resptext}`);
        console.log(`  Auth Code:        ${authResponse.authcode || 'N/A'}`);
        console.log(`  Reference #:      ${authResponse.retref}`);
        console.log(`  Token:            ${authResponse.token}`);
        console.log(`  Amount:           $${authResponse.amount}`);
        console.log(`  Masked Account:   ${authResponse.account}`);
        console.log(`  Commercial Card:  ${authResponse.commcard || 'N/A'}`);
        console.log(`  CVV Response:     ${authResponse.cvvresp || 'N/A'}`);
        console.log(`  AVS Response:     ${authResponse.avsresp || 'N/A'}`);

        if (authResponse.respstat === 'A') {
            // ═══════════════════════════════════════════════════════════════
            // STEP 3: Inquire Transaction Status
            // ═══════════════════════════════════════════════════════════════
            console.log('\n═══════════════════════════════════════════════════════════════');
            console.log('STEP 3: Inquiring Transaction Status...');
            console.log('═══════════════════════════════════════════════════════════════');

            const inquireResponse = await client.inquire(authResponse.retref);

            console.log('\nTransaction Status:');
            console.log('─────────────────────────────────────────────────────────────');
            console.log(`  Reference #:      ${inquireResponse.retref}`);
            console.log(`  Amount:           $${inquireResponse.amount}`);
            console.log(`  Settlement:       ${inquireResponse.setlstat}`);
            console.log(`  Voidable:         ${inquireResponse.voidable || 'N/A'}`);
            console.log(`  Refundable:       ${inquireResponse.refundable || 'N/A'}`);
        }

        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('🎉 Demo Complete!');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('\nYou can verify this transaction in the CardPointe portal:');
        console.log('  URL:      https://cardpointe-uat.cardconnect.com');
        console.log('  Username: FreelyTest');
        console.log('  Password: TestAccount-123');
        console.log('');

    } catch (error) {
        console.error('\n❌ Error:', error);
        process.exit(1);
    }
}

// Run the demo
runDemo();
