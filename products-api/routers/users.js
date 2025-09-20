require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const express = require("express");
const router = express.Router();

const { MongoClient, ObjectId } = require("mongodb");
const mongo = new MongoClient(process.env.MONGO);
const db = mongo.db("shop");

const multer = require("multer");
const storage = multer.diskStorage({
    destination: process.env.PROFILE_IMAGES_PATH,
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    },
});
const upload = multer({ storage });

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 **/

const auth = (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization && authorization.split(" ")[1];

    if (!token) {
        return res.sendStatus(403).json({ msg: "Unathorized Access" });
    }

    jwt.verify(token, process.env.SECRET, (err, data) => {
        if (err) {
            return res.sendStatus(403).json(err);
        }

        res.locals.user = data;
        next();
    });
};

router.get("/verify", auth, async (req, res) => {
    const localUser = res.locals.user;
    if (localUser) {
        const user = await db
            .collection("users")
            .aggregate([
                {
                    $match: {
                        _id: new ObjectId(localUser._id),
                    },
                },
            ])
            .toArray();
        if (localUser.productCount != user[0].productCount)
            localUser.productCount = user[0].productCount;
    }

    return res.json(localUser);
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.sendStatus(400).json({ msg: "username and password Required" });
    }

    const user = await db.collection("users").findOne({ username });
    if (user) {
        if (await bcryptjs.compare(password, user.password)) {
            const token = jwt.sign(user, process.env.SECRET);
            return res.json({ token });
        }
    }

    return res.sendStatus(401).json({ msg: "username or password incorrect" });
});

router.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.sendStatus(400).json({ msg: "Username and Password required" });
    }

    try {
        const hash = await bcryptjs.hash(password, 10);

        const result = await db
            .collection("users")
            .insertOne({ name: "", username, password: hash, bio: "", created: new Date() });

        return res.json({ _id: result.insertedId, name: "", username, bio: "" });
    } catch (err) {
        return res.status(500).json(err.message);
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
        const data = await db
            .collection("products")
            .aggregate([
                {
                    $match: {
                        owner: new ObjectId(user._id),
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

        return res.json({ user, products: data });
    } catch (err) {
        return res.sendStatus(500);
    }
});

router.post("/photo/:id", upload.single("photo"), async (req, res) => {
    const id = req.params.id;
    const fileName = req.file.filename;

    try {
        await db.collection("users").updateOne(
            { _id: new ObjectId(id) },
            {
                $set: { photo: fileName },
            }
        );
    } catch (e) {
        return res.status(500).json({ msg: e.message });
    }

    return res.json({ msg: "Photo updated" });
});

router.get("/order-history/:id", auth, async (req, res) => {
    const { id } = req.params;

    try {
        const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
        const products = await db
            .collection("products")
            .aggregate([
                {
                    $match: {
                        _id: {
                            $in: user.bought_item,
                        },
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

        return res.json(products);
    } catch (e) {
        return res.send({ msg: e.message });
    }
});

router.put("/update-profile/:id", async (req, res) => {
    const { id } = req.params;
    const { name, username } = req.body.body;

    try {
        await db.collection("users").updateOne(
            {
                _id: new ObjectId(id),
            },
            {
                $set: { name: name, username: username },
            }
        );
    } catch (e) {
        return res.status(500).json({ msg: e.message });
    }

    return res.json({ msg: "profile updated" });
});

module.exports = { usersRouter: router, auth };
