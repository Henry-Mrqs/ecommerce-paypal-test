import { Request,Response } from "express";

import { User } from "../models/User";
import { Product } from "../models/Product";

export const cart = (req: Request, res: Response) => {
    res.render('pages/cart');
}