const express = require("express");
const router = express.Router();
const Goods = require("../schemas/goods.js");
const Cart = require("../schemas/cart.js");

// /routes/goods.js
const goods = [
    {
        goodsId: 4,
        name: "상품 4",
        thumbnailUrl:
            "https://cdn.pixabay.com/photo/2016/09/07/02/11/frogs-1650657_1280.jpg",
        category: "drink",
        price: 0.1,
    },
    {
        goodsId: 3,
        name: "상품 3",
        thumbnailUrl:
            "https://cdn.pixabay.com/photo/2016/09/07/02/12/frogs-1650658_1280.jpg",
        category: "drink",
        price: 2.2,
    },
    {
        goodsId: 2,
        name: "상품 2",
        thumbnailUrl:
            "https://cdn.pixabay.com/photo/2014/08/26/19/19/wine-428316_1280.jpg",
        category: "drink",
        price: 0.11,
    },
    {
        goodsId: 1,
        name: "상품 1",
        thumbnailUrl:
            "https://cdn.pixabay.com/photo/2016/09/07/19/54/wines-1652455_1280.jpg",
        category: "drink",
        price: 6.2,
    },
];

router.get("/goods", (req, res) => {
    return res.status(200).json({ goods });
    res.status(200).json({ haha: "hoho" });
});

router.get("/goods/:goodsId", (req, res) => {
    const { goodsId } = req.params;
    console.log(goodsId);

    const detail = goods.find((el) => el.goodsId === Number(goodsId));

    console.log(detail);

    res.status(200).json({ detail });
});

router.post("/goods", async (req, res) => {
    const { goodsId, name, thumbnailUrl, category, price } = req.body;

    try {
        const goods = await Goods.find({ goodsId });
        if (goods.length > 0) {
            res.status(400).json({
                success: false,
                errorMessage: "duplicate error",
            });
        }

        const createdGoods = await Goods.create({
            goodsId,
            name,
            thumbnailUrl,
            category,
            price,
        });
        res.status(200).json({
            goods: createdGoods,
            success: true,
        });
    } catch (error) {
        res.status(400).json({ success: false, errorMessage: "fail", error });
    }
});

router.post("/goods/:goodsId/cart", async (req, res) => {
    const { goodsId } = req.params;
    const { quantity } = req.body;

    try {
        const existsCarts = await Cart.find({ goodsId });
        if (existsCarts.length > 0) {
            return res.status(400).json({
                success: false,
                errorMessage: "Duplicate Error",
            });
        }

        const createdCarts = await Cart.create({ goodsId, quantity });

        res.status(200).json({
            success: true,
            created: createdCarts,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            errorMessage: "fail",
        });
    }
});

router.put("/goods/:goodsId/cart", async (req, res) => {
    const { goodsId } = req.params;
    const { quantity } = req.body;

    try {
        const existsCarts = await Cart.find({ goodsId });
        if (existsCarts.length > 0) {
            await Cart.updateOne({ goodsId: goodsId }, { quantity: quantity });
        }
        res.status(200).json({
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            errorMessage: "fail",
        });
    }
});

router.delete("/goods/:goodsId/cart", async (req, res) => {
    const { goodsId } = req.params;
    try {
        const existsCarts = await Cart.find({ goodsId });
        if (existsCarts.length > 0) {
            await Cart.deleteOne({ goodsId });
        }
        res.status(200).json({
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            errorMessage: "faile",
        });
    }
});

module.exports = router;
