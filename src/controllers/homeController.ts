import { Request,Response } from "express";

import { User } from "../models/User";

export const home = (req: Request, res: Response) => {
    res.render('pages/home');
}