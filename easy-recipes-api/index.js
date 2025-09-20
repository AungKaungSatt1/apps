require("dotenv").config();

const express = require("express");
const app = express();
require("express-ws")(app);
const path = require("path");

const { db } = require("./routers/meals");

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const cors = require("cors");
app.use(cors());

app.get("/", async (req, res) => {
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
            {
                $sample: {
                    size: 8,
                },
            },
        ])
        .toArray();

    return res.json(data);
});

const { MealsRouter } = require("./routers/meals");
app.use("/meals", MealsRouter);

const { ReviewsRouter } = require("./routers/reviews");
app.use("/reviews", ReviewsRouter);

const { UserRouter } = require("./routers/users");
app.use("/users", UserRouter);

app.use("/images/meals", express.static(path.join(__dirname, process.env.MEALS_FILES_PATH)));

app.use("/images/profiles", express.static(path.join(__dirname, process.env.PROFILES_IMAGES_PATH)));
app.listen(process.env.PORT, () => {
    console.log(`Easy Recipes Api Running at ${process.env.PORT}`);
});
