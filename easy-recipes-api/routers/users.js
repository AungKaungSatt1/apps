require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const express = require("express");
const router = express.Router();

const { MongoClient, ObjectId } = require("mongodb");
const mongo = new MongoClient(process.env.MONGO);
const db = mongo.db("easy-recipes");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 **/

const auth = (req, res, next) => {
	const { authorization } = req.headers;
	const token = authorization && authorization.split(" ")[1];

	if (!token) return res.sendStatus(403).json({ msg: "Unauthorized Access" });

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
	// if (localUser) {
	// 	const user = await db
	// 		.collection("users")
	// 		.aggregate([
	// 			{
	// 				$match: {
	// 					_id: new ObjectId(localUser._id),
	// 				},
	// 			},
	// 		])
	// 		.toArray();
	// 	if (localUser.productCount != user[0].productCount)
	// 		localUser.productCount = user[0].productCount;
	// }

	return res.json(localUser);
});

module.exports = { UserRouter: router };
