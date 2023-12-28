import { Request, Response } from "express";

import { Product } from "../models/Product";
import { User } from "../models/User";
import { CartProducts } from "../models/Cart";

import * as paypal from 'paypal-rest-sdk';

paypal.configure({
    'mode': 'sandbox',
    'client_id': 'AfiS4D8ip-sTrn42U_HJT1DH0jg4nZvXYLA_M_mLXklxl2vCUjyY98iyHoaOY3oRd-MGXd5YkkdfZoPE',
    'client_secret': 'ELR3Q5H6dK991eTLTZXZqY2_PfjoGlx9N1J0SY5nBsEDqch3vvC7f4TA8WH88eZQXPIeN9gUvSo4O-Ms'
})


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
                }

            } else {
                cartList.push(newCartProduct);
            }

            console.log("Carrinho atualizado:", CartProducts.getAll());

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



