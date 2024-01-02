import fetch from "node-fetch";
import { Request, Response } from "express";
import { config } from "dotenv";

config();
const { CLIENT_ID, CLIENT_SECRET, ENVIRONMENT } = process.env;

const base = "https://api-m.sandbox.paypal.com";

export const pay = async (req: Request, res: Response) => {
  const data = await generateAccessToken();
  console.log(data);
  res.json(data);

  let order = await createOrder();
  capturePayment(order.id);
};

async function generateAccessToken() {
  const response = await fetch(base + "/v1/oauth2/token", {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
    },
  });
  const data = await response.json();
  return data.access_token;
}

export async function createOrder() {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: "store_mobile_world_order_1234",
          description: "Mobile World Store order-1234",
          amount: {
            currency_code: "USD",
            value: "100.00",
          },
          shipping_address: {
            line1: "2211 N First Street",
            line2: "Building 17",
            city: "San Jose",
            country_code: "US",
            postal_code: "95131",
            state: "CA",
            phone: "(123) 456-7890",
          },
          shipping_method: "United Postal Service",
        },
      ],
    }),
  });
  const data = await response.json();
  console.log(data.id);
  return data.id;
}

export async function capturePayment(orderId: string) {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderId}/capture`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  console.log(data);
  return data;
}
