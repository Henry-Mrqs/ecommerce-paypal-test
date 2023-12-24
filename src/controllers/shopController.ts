import { Request,Response } from "express";

import { Product } from "../models/Product";

export const shop = (req: Request, res: Response) => {
    let productList = Product.getAll();
    res.render('pages/shop', {
        productList
    });
}

