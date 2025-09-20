require("dotenv").config();

const express = require("express");
const router = express.Router();

const { MongoClient, ObjectId } = require("mongodb");
const mongo = new MongoClient(process.env.MONGO);
const db = mongo.db("easy-recipes");
const { auth } = require("./users");

router.get("/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const data = await db
            .collection("reviews")
            .aggregate([
                {
                    $match: {
                        reviewed_meal: new ObjectId(id),
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                {
                    $unwind: "$user",
                },
            ])
            .toArray();

        return res.json(data);
    } catch (e) {
        return res.sendStatus(500).json({ msg: e.message });
    }
});

module.exports = { ReviewsRouter: router };
