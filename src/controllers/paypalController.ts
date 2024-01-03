import fetch from "node-fetch";
import { Request, Response } from "express";
import { config } from "dotenv";

import { User } from "../models/User";
import { CartProducts } from "../models/Cart";

config();
const { CLIENT_ID, CLIENT_SECRET } = process.env;

const base = "https://api-m.sandbox.paypal.com";

export const createOrder = async (req: Request, res: Response) => {
  const cartValue = CartProducts.totalPrice();
  const userInfo = User.getAll();

  generateAccessToken()
    .then((access_token) => {
      let order_data_json = {
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: "store_mobile_world_order_1234",
            description: "Mobile World Store order-1234",
            amount: {
              currency_code: "USD",
              value: cartValue.toString(),
            },
            shipping: {
              name: {
                full_name: userInfo[0].name + " " + userInfo[0].lastName,
              },
              type: "SHIPPING",
              line1: userInfo[0].address.line1,
              line2: userInfo[0].address.line2,
              country_code: "US",
              postal_code: userInfo[0].address.zip,
              state: userInfo[0].address.state,
              phone: userInfo[0].phone,
            },
            shipping_method: "United Postal Service",
          },
        ],
      };
      const data = JSON.stringify(order_data_json);

      fetch(base + "/v2/checkout/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: data,
      })
        .then((res) => res.json())
        .then((json) => {
          res.send(json);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

export const completeOrder = async (req: Request, res: Response) => {
  generateAccessToken()
    .then((access_token) => {
      fetch(
        base + "/v2/checkout/orders/" + req.body.order_id + "/" + "capture",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          res.send(json);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
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
