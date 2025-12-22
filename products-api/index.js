require("dotenv").config();

const { db } = require("./routers/products");
const express = require("express");
const app = express();
require("express-ws")(app);

const path = require("path");

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const cors = require("cors");
app.use(cors());

app.get("/", async (req, res) => {
	const data = await db
		.collection("products")
		.aggregate([
			{
				$match: {
					type: "product",
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
					localField: "owner",
					foreignField: "_id",
					as: "owner",
				},
			},
			{
				$unwind: "$owner",
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

const { productsRouter } = require("./routers/products");
app.use("/shop", productsRouter);

const { usersRouter } = require("./routers/users");
app.use("/users", usersRouter);

const { wsRouter, clients } = require("./routers/ws");
app.use(wsRouter);

app.use(
	"/images/products-images",
	express.static(path.join(__dirname, process.env.PRODUCTS_IMAGES_PATH))
);

app.use(
	"/images/profile-images",
	express.static(path.join(__dirname, process.env.PROFILE_IMAGES_PATH))
);

app.listen(process.env.PORT, () => {
	console.log(`Api running at ${process.env.PORT}...`);
});
