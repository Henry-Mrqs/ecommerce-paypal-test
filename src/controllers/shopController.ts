import { Request, Response } from "express";

import { Product } from "../models/Product";
import { User } from "../models/User";
import { CartProducts } from "../models/Cart";


export const shop = (req: Request, res: Response) => {
    let productList = Product.getAll();
    console.log('estou no metodo *** GET *** da Pagina Shop');
    res.render('pages/shop', {
        productList
    });
}


export const shopCart = (req: Request, res: Response) => {

    console.log('estou no metodo *** POST *** da Pagina Shop');
    
    try {
        if (req.body) {
            // Certifique-se de que req.body tem a estrutura correta (UserType)
            const newCartProduct = req.body;

            // Obtenha o array de usuários
            const cartList = CartProducts.getAll();

            let productList = Product.getAll();

            // Adicione o novo produto
            const existingProductIndex = cartList.findIndex(product => product.productId === newCartProduct.productId);

            console.log('a certificação está retornando:', existingProductIndex)

            // Se já existe, substitua-o; caso contrário, adicione o novo usuário
            if (existingProductIndex !== -1) {
                if(!newCartProduct.remove){
                    // Converta para número antes de realizar a soma
                    cartList[existingProductIndex].amount = +cartList[existingProductIndex].amount + 1;
                }else if(newCartProduct.remove && +cartList[existingProductIndex].amount > 1){
                    cartList[existingProductIndex].amount = +cartList[existingProductIndex].amount - 1;
                }else{

                    const findindex = cartList.findIndex(product => product.productId === newCartProduct.productId);

                    cartList.splice(findindex, 1)
                    cartList[existingProductIndex].amount = +cartList[existingProductIndex].amount;
                }

            } else {
                cartList.push(newCartProduct);
            }

            console.log("Carrinho atualizado:", CartProducts.getAll());

            const cartAmount = CartProducts.totalProducts();
            const cartValue = CartProducts.totalPrice();
            const cartSku = CartProducts.cartSku();

            console.log('Amount ----- ', cartAmount)
            console.log('Value Total ----- ', cartValue)
            console.log('Meu SKU ----- ', cartSku)

            res.render('pages/shop', {
                cartList,
                productList
            });

        } else {
            console.error("Erro ao processar a solicitação: Body vazio");
            res.status(500).send("Erro interno do servidor");
        }
    } catch (error) {
        console.error("Erro ao processar a solicitação:", error);
        res.status(500).send("Erro interno do servidor");
    }
}








export const pay = (req: Request, res: Response) => {

    const cartProducts = CartProducts.getAll();
    const cartAmount = CartProducts.totalProducts();
    const cartValue = CartProducts.totalPrice();
    const cartSku = CartProducts.cartSku();

}




const base = "https://api-m.sandbox.paypal.com";
const clientId = 'AYO-tPiuAS1kk2DvBCfhc7tOAi_Pt97_gvwjAPPBtQe5pmLbf2eyuBX20R2y2YCHDYBAspGj_oeB03xZ'
const clientSecret = 'EKBAGopfE2bWWV1_N15fjsbTY9sZIciWcq-GybK1oT6vdgwTfUgmnIQoe8Kbtqdler6TII29gcElVvd9'

const generateAccessToken = async () => {
  try {
    if (!clientId || !clientSecret) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
        clientId + ":" + clientSecret,
    ).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};

const cart = CartProducts.getAll()
const createOrder = async (cart: object) => {
    // use the cart information passed from the front-end to calculate the purchase unit details
    console.log(
      "shopping cart information passed from the frontend createOrder() callback:",
      cart,
    );
    
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const payload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: "100.00",
          },
        },
      ],
    };
    
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
        // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
        // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
      },
      method: "POST",
      body: JSON.stringify(payload),
    });
    
    //return handleResponse(response);
  };