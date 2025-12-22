require("dotenv").config();

const express = require("express");
const router = express.Router();

const { MongoClient, ObjectId } = require("mongodb");
const mongo = new MongoClient(process.env.MONGO);
const db = mongo.db("easy-recipes");

const multer = require("multer");
const storage = multer.diskStorage({
    destination: process.env.MEALS_FILES_PATH,
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    },
});
const upload = multer({ storage });

const { auth } = require("./users");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

router.get("/", async (req, res) => {
    let { page, limit } = req.query;
    let currentDatas = [];
    let currentPage = 0;
    let currentIndex = page == 1 ? 0 : page * limit - limit;

    if (page > currentPage) {
        currentPage = page;
        try {
            const data = await db
                .collection("meals")
                .aggregate([
                    {
                        $match: {
                            meals: "meals",
                        },
                    },
                    {
                        $sort: {
                            created: -1,
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

            for (let i = 0; i < limit; i++) {
                currentDatas.push(data[currentIndex]);
                if (currentIndex > data.length) break;
                currentIndex += 1;
            }

            return res.json(currentDatas);
        } catch (error) {
            return res.send(error);
        }
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await getMeal(id);

        return res.json(data);
    } catch (e) {
        return res.sendStatus(500).json({ msg: "Error" });
    }
});

router.post("/post/:id", [auth, upload.single("photo")], async (req, res) => {
    const id = req.params.id;
    const { name, type, steps, cuisine, servings, time } = req.body;
    const filename = req.file ? req.file.originalname : "";
    const meal = {
        name: name,
        description: steps,
        type: type,
        rating: 0,
        cuisine,
        meals: "meals",
        image: filename,
        serving: servings,
        reviews: [],
        cooking_time: time + " mins",
        postedBy: new ObjectId(id),
        created: new Date(),
    };

    await db.collection("users").updateOne(
        {
            _id: new ObjectId(id),
        },
        {
            $inc: { mealsCount: +1 },
        }
    );

    try {
        await db.collection("meals").insertOne(meal);
        // const resultPost = await getProduct(result.insertedId);

        // // clients.map((client) => {
        // //     client.send(JSON.stringify({ type: "product", product: resultPost }));
        // // });
    } catch (e) {
        return res.sendStatus(500).json({ msg: e.message });
    }
    return res.json({ msg: "Meal Uploaded" });
});

async function getMeal(id) {
    try {
        const data = await db
            .collection("meals")
            .aggregate([
                {
                    $match: {
                        _id: new ObjectId(id),
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

        return data[0];
    } catch (e) {
        return false;
    }
}

module.exports = { MealsRouter: router, db };
