import { Request,Response } from "express";

import { Product } from "../models/Product";

export const shop = (req: Request, res: Response) => {
    res.render('pages/shop');
}