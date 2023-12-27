import { Request,Response } from "express";

export const cart = (req: Request, res: Response) => {
    res.render('pages/cart');
}