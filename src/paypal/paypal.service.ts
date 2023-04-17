import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { configEnv } from 'src/config.env';

@Injectable()
export class PaypalService {
  constructor() {}

  async createOrder(dto: { amount: string; description: string }) {
    const accessToken = await this.generateAccessToken();
    const url = `${configEnv.paypal.PAYPAL_BASE_API}/v2/checkout/orders`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PayPal-Request-Id': '7b92603e-77ed-4896-8e78-5dea2050476a',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: '1',
            amount: {
              currency_code: 'USD',
              value: '1.5',
            },
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
              payment_method_selected: 'PAYPAL',
              brand_name: 'EXAMPLE INC',
              locale: 'en-US',
              landing_page: 'LOGIN',
              shipping_preference: 'SET_PROVIDED_ADDRESS',
              user_action: 'PAY_NOW',
              return_url: 'https://example.com/returnUrl',
              cancel_url: 'https://example.com/cancelUrl',
            },
          },
        },
      }),
    });

    return await this.handleResponse(response);
  }

  async capturePayment(orderId: any) {
    const accessToken = await this.generateAccessToken();
    const url = `${configEnv.paypal.PAYPAL_BASE_API}/v2/checkout/orders/${orderId}/capture`;
    const response = await fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return await this.handleResponse(response);
  }

  async generateAccessToken() {
    const auth = Buffer.from(
      configEnv.paypal.PAYPAL_CLIENT_ID +
        ':' +
        configEnv.paypal.PAYPAL_SECRET_KEY,
    ).toString('base64');
    const response = await fetch(
      `${configEnv.paypal.PAYPAL_BASE_API}/v1/oauth2/token`,
      {
        method: 'post',
        body: 'grant_type=client_credentials',
        headers: {
          Authorization: `Basic ${auth}`,
        },
      },
    );

    const jsonData = await this.handleResponse(response);
    return jsonData.access_token;
  }

  

  async handleResponse(response) {
    if (response.status === 200 || response.status === 201) {
      return response.json();
    }

    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}
