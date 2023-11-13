const express = require("express");
const router = express.Router();

const Cart = require("../schemas/cart.js");
const Goods = require("../schemas/goods.js");

// 장바구니 목록
router.get("/carts", async (req, res) => {
    try {
        const carts = await Cart.find();

        const goodsIds = carts.map((cart) => {
            return cart.goodsId;
        });

        const goods = await Goods.find({ goodsId: goodsIds });

        const results = carts.map((cart) => {
            return {
                quantity: cart.quantity,
                goods: goods.find((item) => cart.goodsId === item.goodsId),
            };
        });

        res.status(200).json({ carts: results });
    } catch (error) {
        res.status(400).json({
            success: false,
            errorMessage: "fail",
            error,
        });
    }
});

module.exports = router;
