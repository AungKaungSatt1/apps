require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const express = require("express");
const router = express.Router();

const { MongoClient, ObjectId } = require("mongodb");
const mongo = new MongoClient(process.env.MONGO);
const db = mongo.db("easy-recipes");

const multer = require("multer");
const storage = multer.diskStorage({
    destination: process.env.PROFILES_IMAGES_PATH,
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

    if (!token) return res.sendStatus(403).json({ msg: "Unauthorized Access" });

    jwt.verify(token, process.env.SECRET, async (err, data) => {
        if (err) {
            return res.sendStatus(403).json(err);
        }

        res.locals.user = await db.collection("users").findOne({ _id: new ObjectId(data._id) });
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
        // if (localUser.mealsCount != user[0].mealsCount) localUser.mealsCount = user[0].mealsCount;
        // if (localUser.photo != user[0].photo) localUser.photo = user[0].photo;
        console.log(user[0]);
        console.log(localUser);
    }

    return res.json(localUser);
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.sendStatus(400).json({ msg: "username and password Required" });
    }

    const user = await db.collection("users").findOne({ email });
    if (user) {
        if (await bcryptjs.compare(password, user.password)) {
            const token = jwt.sign(user, process.env.SECRET);
            return res.json({ token });
        }
    }

    return res.sendStatus(401).json({ msg: "username or password incorrect" });
});

router.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.sendStatus(400).json({ msg: "Email and Password required." });
    }

    try {
        const hash = await bcryptjs.hash(password, 10);

        const result = await db.collection("users").insertOne({
            name: "",
            username: "",
            email,
            password: hash,
            bio: "",
            created: new Date(),
            photo: "",
            mealsCount: 0,
        });

        return res.json({ _id: result.insertedId, name: "", username: "", bio: "" });
    } catch (e) {
        return res.status(500).json(e.message);
    }
});

router.get("/profile/:id", auth, async (req, res) => {
    const { id } = req.params;

    try {
        const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
        const data = await db
            .collection("meals")
            .aggregate([
                {
                    $match: {
                        postedBy: new ObjectId(user._id),
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "postedBy",
                        foreignField: "_id",
                        as: "postedBy",
                    },
                },
                {
                    $unwind: "$postedBy",
                },
            ])
            .toArray();

        return res.json({ user, meals: data });
    } catch (err) {
        return res.sendStatus(500);
    }
});

router.get("/:id/settings/profile", auth, async (req, res) => {
    const id = req.params.id;

    try {
        const user = await db.collection("users").findOne({
            _id: new ObjectId(id),
        });

        return res.json(user);
    } catch (e) {
        return res.status(500).send({ msg: e.message });
    }
});

router.post(
    "/:id/settings/profile/update-profile",
    [auth, upload.single("photo")],
    async (req, res) => {
        const id = req.params.id;
        const fileName = req.file ? req.file.filename : "";
        const { name, username, bio } = req.body;

        try {
            await db.collection("users").updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        photo: fileName == "" ? res.locals.user.photo : fileName,
                        name: name,
                        username: username,
                        bio: bio,
                    },
                }
            );
        } catch (e) {
            return res.status(500).json({ msg: e.message });
        }

        return res.json({ msg: "Photo updated" });
    }
);

module.exports = { UserRouter: router, auth };
