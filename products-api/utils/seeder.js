require("dotenv").config();

const { faker } = require("@faker-js/faker");
const bcryptjs = require("bcryptjs");

const { MongoClient, ObjectId } = require("mongodb");
const client = new MongoClient(process.env.MONGO);
const db = client.db("shop");

const number_of_products = 20;
const number_of_users = 40;

const first_user_id = "66a8b1dd03afe7143409f7e0";
const product_types = ["cloth", "food", "accessory"];

async function seedUsers() {
    await db.collection("users").deleteMany({});

    let hash = await bcryptjs.hash("password", 10);
    let data = [];

    for (let i = 0; i < number_of_users; i++) {
        let firstName = faker.person.firstName();
        let lastName = faker.person.lastName();

        data.push({
            name: `${firstName} ${lastName}`,
            username: `${firstName}${lastName}`.toLocaleLowerCase(),
            password: hash,
            bio: faker.person.bio(),
            created: new Date(),
            photo: "",
            productCount: 0,
        });
    }

    data.push({
        _id: new ObjectId(first_user_id),
        name: "Alice",
        username: "alice",
        password: hash,
        bio: faker.person.bio(),
        created: new Date(),
        photo: "",
        productCount: 0,
    });

    try {
        return await db.collection("users").insertMany(data);
    } finally {
        console.log("Users Seeding Done");
    }
}

async function seedProducts(users) {
    await db.collection("products").deleteMany({});

    let data = [];

    for (let i = 0; i < number_of_products; i++) {
        let name = faker.commerce.productName;
        let price = faker.commerce.price;
        let description = faker.commerce.productDescription;
        let user = users[Math.floor(Math.random() * number_of_users)];
        let count = 0;

        data.push({
            name: `${name("")}`,
            price: `$${price({ min: 0, max: 100 })}`,
            photo: "",
            type: "product",
            product_type:
                product_types[Math.floor(Math.random() * product_types.length)],
            description: `${description("")}`,
            cart: false,
            owner: user,
            created: new Date(),
        });

        await db.collection("users").updateOne(
            {
                _id: new ObjectId(user),
            },
            {
                $set: {
                    productCount: count + 1,
                },
            }
        );
    }
    try {
        return await db.collection("products").insertMany(data);
    } finally {
        console.log("Products seeding done");
    }
}

async function seedBuyers() {
    try {
        for (let i = 0; i < number_of_products; i++) {
            let sample = Math.floor((Math.random() * number_of_users) / 2) + 5;

            let randomItem = await db
                .collection("products")
                .aggregate([
                    {
                        $sample: { size: 1 },
                    },
                ])
                .toArray();
            let randomUsers = await db
                .collection("users")
                .aggregate([
                    {
                        $sample: { size: sample },
                    },
                ])
                .toArray();

            let bought_item = randomItem[0]._id;
            let buyers = randomUsers.map((user) => user._id);

            await db.collection("products").updateMany(
                {
                    _id: new ObjectId(bought_item),
                },
                {
                    $set: { buyers: buyers },
                }
            );

            for (let i = 0; i < buyers.length; i++) {
                const user = await db
                    .collection("users")
                    .findOne({ _id: new ObjectId(buyers[i]) });
                if (!user.bought_item)
                    await db.collection("users").updateOne(
                        {
                            _id: new ObjectId(buyers[i]),
                        },
                        {
                            $set: {
                                bought_item: [bought_item],
                            },
                        }
                    );
                else
                    await db.collection("users").updateOne(
                        {
                            _id: new ObjectId(buyers[i]),
                        },
                        {
                            $push: {
                                bought_item: bought_item,
                            },
                        }
                    );
            }
        }
    } finally {
        console.log("Done seeding Bought Items and Buyers");
    }
}

async function seed() {
    console.log("Start seeding Users");
    let users = await seedUsers();

    console.log("Start seeding products");
    let products = await seedProducts(users.insertedIds);

    console.log("Start seeding Bought Items and Buyers");
    await seedBuyers();

    process.exit();
}

seed();
