require("dotenv").config();

const { faker } = require("@faker-js/faker");
const bcryptjs = require("bcryptjs");

const { MongoClient, ObjectId } = require("mongodb");
const client = new MongoClient(process.env.MONGO);
const db = client.db("easy-recipes");

const number_of_users = 20;
const number_of_meals = 30;
const number_of_reviews = 10;

const first_user_id = "67a0ca8858894c0f32a26a13";

async function insertUsers() {
    await db.collection("users").deleteMany({});

    let hash = await bcryptjs.hash("password", 10);
    let data = [];

    for (let i = 0; i < number_of_users; i++) {
        let firstName = faker.person.firstName();
        let lastName = faker.person.lastName();
        let email = faker.internet.email();

        data.push({
            name: `${firstName} ${lastName}`,
            username: `@${firstName}${lastName}`.toLocaleLowerCase(),
            email,
            password: hash,
            bio: faker.person.bio(),
            created: new Date(),
            photo: "",
            mealsCount: 0,
        });
    }

    data.push({
        _id: new ObjectId(first_user_id),
        name: "Alice",
        username: "alice",
        email: "alice@gmail.com",
        password: hash,
        bio: faker.person.bio(),
        created: new Date(),
        photo: "",
        mealsCount: 0,
    });

    try {
        return await db.collection("users").insertMany(data);
    } finally {
        console.log("Users Seeding Done");
    }
}

async function seedMeals(users) {
    await db.collection("meals").deleteMany({});

    let data = [];
    let food_types = ["Desserts", "Snacks", "Breakfast", "Dinner", "Lunch"];
    let cuisine_types = [
        "American",
        "Japanese",
        "Chinese",
        "Italian",
        "Korean",
        "Thai",
    ];

    for (let i = 0; i < number_of_meals; i++) {
        let description = faker.food.description();
        let name = faker.food.dish();
        let cuisine =
            cuisine_types[Math.floor(Math.random() * cuisine_types.length)];
        let type = food_types[Math.floor(Math.random() * food_types.length)];
        let user = users[Math.floor(Math.random() * number_of_users)];
        let rating = Math.floor(Math.random() * 40);
        let cooking_time = Math.floor(Math.random() * 60);
        let serving = Math.floor(Math.random() * 6);

        data.push({
            name: name,
            description: description,
            cuisine: cuisine,
            rating: rating,
            type: type,
            reviews: [],
            image: "",
            postedBy: user,
            serving: serving,
            cooking_time: cooking_time + " mins",
            meals: "meals",
            created: new Date(),
        });

        await db.collection("users").updateOne(
            {
                _id: new ObjectId(user),
            },
            {
                $inc: {
                    mealsCount: 1,
                },
            }
        );
    }

    try {
        return await db.collection("meals").insertMany(data);
    } finally {
        console.log("Meals seeding done");
    }
}

async function seedReviews(users, meals) {
    await db.collection("reviews").deleteMany({});

    let data = [];

    for (let i = 0; i < number_of_reviews; i++) {
        let content = faker.lorem.paragraph();
        let random_meal = meals[Math.floor(Math.random() * number_of_meals)];
        let random_user = users[Math.floor(Math.random() * number_of_users)];
        let likes = Math.floor(Math.random() * 100);
        let dislikes = Math.floor(Math.random() * 100);

        data.push({
            content: content,
            reviewed_meal: random_meal,
            user: random_user,
            likes: likes,
            dislikes: dislikes,
        });

        await db.collection("meals").updateOne(
            {
                _id: new ObjectId(random_meal),
            },
            {
                $set: {
                    reviews: random_user,
                },
            }
        );
    }

    try {
        await db.collection("reviews").insertMany(data);
    } finally {
        console.log("Reviews Seeding Done");
    }
}

async function seed() {
    let users = await insertUsers();

    let meals = await seedMeals(users.insertedIds);

    await seedReviews(users.insertedIds, meals.insertedIds);

    process.exit();
}

seed();
