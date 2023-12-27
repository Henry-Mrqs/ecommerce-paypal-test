import { Router } from "express";
import { home, homeSubmit } from "../controllers/homeController";
import { cart } from "../controllers/cartController";
import { pay, shop } from "../controllers/shopController";

const router = Router();

router.get('/', home);
router.post('/', homeSubmit);

router.get('/shop', shop);

router.post('/pay', pay);

router.get('/cart', cart);

export default router;