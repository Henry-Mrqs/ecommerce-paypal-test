import { Request, Response } from "express";

import { Product } from "../models/Product";
import { CartProducts } from "../models/Cart";

export const shop = (req: Request, res: Response) => {
  let productList = Product.getAll();
  console.log("estou no metodo *** GET *** da Pagina Shop");
  res.render("pages/shop", {
    productList,
  });
};

export const shopCart = (req: Request, res: Response) => {
  console.log("estou no metodo *** POST *** da Pagina Shop");

  try {
    if (req.body) {
      // Certifique-se de que req.body tem a estrutura correta (UserType)
      const newCartProduct = req.body;

      // Obtenha o array de usuários
      const cartList = CartProducts.getAll();
      let productList = Product.getAll();
      const existingProductIndex = cartList.findIndex(
        (product) => product.productId === newCartProduct.productId
      );

      console.log("A verificação está retornando:", existingProductIndex);

      if (existingProductIndex !== -1) {
        if (!newCartProduct.remove) {
          cartList[existingProductIndex].amount =
            +cartList[existingProductIndex].amount + 1;
        } else if (
          newCartProduct.remove &&
          +cartList[existingProductIndex].amount > 1
        ) {
          cartList[existingProductIndex].amount =
            +cartList[existingProductIndex].amount - 1;
        } else {
          cartList.splice(existingProductIndex, 1);
        }
      } else {
        cartList.push(newCartProduct);
      }

      console.log("Carrinho atualizado:", CartProducts.getAll());

      const cartAmount = CartProducts.totalProducts();
      const cartValue = CartProducts.totalPrice();
      const cartSku = CartProducts.cartSku();

      console.log("Amount ----- ", cartAmount);
      console.log("Value Total ----- ", cartValue);
      console.log("Meu SKU ----- ", cartSku);

      res.render("pages/shop", {
        cartList,
        productList,
      });
    } else {
      console.error("Erro ao processar a solicitação: Body vazio");
      res.status(500).send("Erro interno do servidor");
    }
  } catch (error) {
    console.error("Erro ao processar a solicitação:", error);
    res.status(500).send("Erro interno do servidor");
  }
};
