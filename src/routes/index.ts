import { Router } from "express";
import { home, homeSubmit } from "../controllers/homeController";
import { shopCart, shop, pay } from "../controllers/shopController";

const router = Router();

router.get('/', home);
router.post('/', homeSubmit);

router.get('/shop', shop);
router.post('/shop', shopCart);

router.post('/pay', pay);

export default router;