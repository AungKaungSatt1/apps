require("dotenv").config();

const express = require("express");
const router = express.Router();

const { MongoClient, ObjectId } = require("mongodb");
const mongo = new MongoClient(process.env.MONGO);
const db = mongo.db("shop");

const multer = require("multer");
const storage = multer.diskStorage({
    destination: process.env.PRODUCTS_IMAGES_PATH,
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    },
});
const upload = multer({ storage });

const { auth } = require("./users");
const { clients } = require("./ws");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
router.get("/", async function (req, res) {
    let q = req.query.filter;

    if (q) {
        try {
            let result = await db
                .collection("products")
                .aggregate([
                    {
                        $match: {
                            product_type: new RegExp(`.*${q}.*`, "i"),
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                        },
                    },
                    {
                        $unwind: "$owner",
                    },
                ])
                .toArray();

            if (result) {
                return res.json(result);
            }
        } catch (e) {
            return res.sendStatus(500).json({ msg: e.message });
        }
    } else {
        const data = await db
            .collection("products")
            .aggregate([
                {
                    $match: {
                        type: "product",
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "owner",
                        foreignField: "_id",
                        as: "owner",
                    },
                },
                {
                    $unwind: "$owner",
                },
            ])
            .toArray();

        return res.json(data);
    }
});

router.get("/:id", async function (req, res) {
    const { id } = req.params;
    const product = await getProduct(id);
    if (product) {
        return res.json(product);
    } else {
        return res.sendStatus(500);
    }
});

router.put("/set-cart/:id", auth, async (req, res) => {
    const { id } = req.params;

    const product = await db.collection("products").findOne({ _id: new ObjectId(id) });
    const cart = (product.cart = true);
    const update = await db.collection("products").updateOne(
        { _id: new ObjectId(id) },
        {
            $set: { cart },
        }
    );

    return res.json(update);
});

router.put("/remove-cart/:id", auth, async (req, res) => {
    const { id } = req.params;
    const product = await db.collection("products").findOne({ _id: new ObjectId(id) });
    const cart = (product.cart = false);
    const update = await db.collection("products").updateOne(
        { _id: new ObjectId(id) },
        {
            $set: { cart },
        }
    );

    return res.json(update);
});

router.post("/post-item/:id", upload.single("photo"), async (req, res) => {
    const id = req.params.id;
    const { name, price, description, product_type } = req.body;
    const filename = req.file ? req.file.originalname : "";
    const product = {
        name: name,
        price: price,
        description: description,
        product_type: product_type,
        type: "product",
        photo: filename,
        cart: false,
        owner: new ObjectId(id),
        created: new Date(),
    };

    await db.collection("users").updateOne(
        {
            _id: new ObjectId(id),
        },
        {
            $inc: { productCount: +1 },
        }
    );

    try {
        const result = await db.collection("products").insertOne(product);
        const resultPost = await getProduct(result.insertedId);

        clients.map((client) => {
            client.send(JSON.stringify({ type: "product", product: resultPost }));
        });
    } catch (e) {
        return res.sendStatus(500).json({ msg: e.message });
    }
    return res.json({ msg: "product Uploaded" });
});

router.put("/buy-item/:id", auth, async (req, res) => {
    const id = req.params.id;
    const user = res.locals.user;

    try {
        await db.collection("products").updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $push: {
                    buyers: new ObjectId(user._id),
                },
            }
        );

        await db.collection("users").updateOne(
            {
                _id: new ObjectId(user._id),
            },
            {
                $push: {
                    bought_item: new ObjectId(id),
                },
            }
        );

        return res.json({ msg: "Item Purchased" });
    } catch (e) {
        return res.send({ msg: e.message });
    }
});

async function getProduct(id) {
    try {
        const data = await db
            .collection("products")
            .aggregate([
                {
                    $match: {
                        _id: new ObjectId(id),
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "owner",
                        foreignField: "_id",
                        as: "owner",
                    },
                },
                {
                    $unwind: "$owner",
                },
            ])
            .toArray();

        return data[0];
    } catch (err) {
        return false;
    }
}

module.exports = { productsRouter: router, db };
