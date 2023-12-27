import { Request, Response } from "express";
import { Product } from "../models/Product";

import * as paypal from 'paypal-rest-sdk';

paypal.configure({
    'mode': 'sandbox',
    'client_id': 'AfiS4D8ip-sTrn42U_HJT1DH0jg4nZvXYLA_M_mLXklxl2vCUjyY98iyHoaOY3oRd-MGXd5YkkdfZoPE',
    'client_secret': 'ELR3Q5H6dK991eTLTZXZqY2_PfjoGlx9N1J0SY5nBsEDqch3vvC7f4TA8WH88eZQXPIeN9gUvSo4O-Ms'
})

export const shop = (req: Request, res: Response) => {
    let productList = Product.getAll();
    res.render('pages/shop', {
        productList
    });
}




interface Product {
    name: string;
    productId: string;
    price: string;
    quantity: number;
}

interface ProductInCart extends Product {
    quantity: number;
}



export const pay = (req: Request, res: Response) => {
    // Obtenha os produtos do corpo da solicitação
    const productsInCart: ProductInCart[] = req.body.productsInCart || [];

    if (!Array.isArray(productsInCart)) {
        console.error('Invalid productsInCart data:', productsInCart);
        return res.status(400).send('Invalid productsInCart data.');
    }

    // Verifique se há produtos no carrinho
    if (productsInCart.length === 0) {
        console.error('No products in the cart.');
        return res.status(400).send('No products in the cart.');
    }

    // Mapeie os produtos para o formato desejado para a transação
    const items: paypal.Item[] = productsInCart.map(product => ({
        name: product.name,
        sku: product.productId,
        price: product.price,
        currency: 'USD',
        quantity: product.quantity
    }));

    // Calcule o total do carrinho
    const total: string = productsInCart.reduce((acc, product) => {
        return (acc + parseFloat(product.price) * product.quantity);
    }, 0).toFixed(2);

    // Verifique se o valor total é maior que zero
    if (parseFloat(total) <= 0) {
        console.error('Invalid total amount. Please check your cart. Total:', total);
        return res.status(400).send('Invalid total amount. Please check your cart.');
    }

    console.log('Items for PayPal:', items);
    console.log('Total amount for PayPal:', total);

    const create_payment_json: paypal.Payment = {
        intent: 'sale',
        payer: {
            payment_method: 'paypal'
        },
        redirect_urls: {
            return_url: 'http://localhost/success',
            cancel_url: 'http://localhost/cancel'
        },
        transactions: [{
            item_list: {
                items: items
            },
            amount: {
                currency: 'USD',
                total: total
            },
            description: 'Payment for items in the cart.'
        }]
    };

    paypal.payment.create(create_payment_json, (error, payment) => {
        if (error) {
            console.error('PayPal Error:', error);
            // Log os detalhes do erro, se disponíveis
            if (error.response && error.response.details) {
                console.error('PayPal Error Details:', error.response.details);
            }

            // Tratamento específico para erro de validação
            if (error.response && error.response.name === 'VALIDATION_ERROR') {
                console.error('Invalid request. Please check your input data.');
                return res.status(400).send('Invalid request. Please check your input data.');
            } else {
                console.error('Internal Server Error');
                return res.status(500).send('Internal Server Error');
            }
        } else {
            const approvalUrl = payment.links?.find(link => link.rel === 'approval_url')?.href;
            if (approvalUrl) {
                console.log('Redirecting to PayPal for approval:', approvalUrl);
                return res.redirect(approvalUrl);
            } else {
                console.error('Approval URL not found in payment response.');
                return res.status(500).send('Internal Server Error');
            }
        }
    });
};

export const success = (req: Request, res: Response) => {
    const payerId = req.query.PayerID as string;
    const paymentId = req.query.PaymentID as string;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "5.00"
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, (error: any, payment: any) => {
        if (error) {
            console.log(error.response);
            return res.status(500).send('Internal Server Error');
        } else {
            console.log(JSON.stringify(payment));
            return res.send('success');
        }
    });
};

export const cancel = (req: Request, res: Response) => {
    return res.send('cancelled');
};

