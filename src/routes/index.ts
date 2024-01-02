import { Router } from "express";
import { home, homeSubmit } from "../controllers/homeController";
import { shopCart, shop } from "../controllers/shopController";
import { completeOrder, createOrder } from "../controllers/paypalController";

const router = Router();

router.get("/", home);
router.post("/", homeSubmit);

router.get("/shop", shop);
router.post("/shop", shopCart);

router.post("/create_order", createOrder);
router.post("/complete_order", completeOrder);

export default router;
