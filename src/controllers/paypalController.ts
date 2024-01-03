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
  const userList = User.getAll();
  const user = userList[0];

  try {
    const accessToken = await generateAccessToken();
    console.log(accessToken);
    let order_data_json = {
      intent: "CAPTURE",
      payer: {
        name: {
          given_name: user.name,
          surname: user.lastName,
        },
        email_address: user.email,
      },
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
              full_name: user.name + " " + user.lastName,
            },
            address: {
              country_code: "US",
              address_line_1: user.address.line1,
              address_line_2: user.address.line2,
              postal_code: user.address.zip,
              admin_area_2: "City",
              admin_area_1: "NY",
            },
          },
        },
      ],
    };
    const data = JSON.stringify(order_data_json);

    const responseCheckout = await fetch(base + "/v2/checkout/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: data,
    });
    const order = await responseCheckout.json();
    return res.json({ order }).status(200);
  } catch (err) {
    console.log(err);
  }
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
