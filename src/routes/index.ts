import { Router } from "express";
import { home, homeSubmit } from "../controllers/homeController";
import { shopCart, shop } from "../controllers/shopController";

const router = Router();

router.get('/', home);
router.post('/', homeSubmit);

router.get('/shop', shop);
router.post('/shop', shopCart);

export default router;