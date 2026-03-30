/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const up = async (db, client) => {
  // TODO write your migration here.
  // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
  await db.collection("categories").insertMany([
    {
      slug: "c1",
      title: "Italian",
      color: "#f5428d",
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    },
    {
      slug: "c2",
      title: "Quick & Easy",
      color: "#f54242",
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    },
    {
      slug: "c3",
      title: "Hamburgers",
      color: "#f5a442",
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    },
    {
      slug: "c4",
      title: "German",
      color: "#f54242",
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    },
    {
      slug: "c5",
      title: "Light & Lovely",
      color: "#368dff",
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    },
    {
      slug: "c6",
      title: "Exotic",
      color: "#41d95d",
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    },
    {
      slug: "c7",
      title: "Breakfast",
      color: "#9eecff",
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    },
    {
      slug: "c8",
      title: "Asian",
      color: "#b9ffb0",
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    },
    {
      slug: "c9",
      title: "French",
      color: "#ffc7ff",
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    },
    {
      slug: "c10",
      title: "Summer",
      color: "#47fced",
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    },
  ]);

  console.log("Index creation", process.env.NODE_ENV);
  if (process.env.NODE_ENV === "production") {
    await db
      .collection("categories")
      .createIndex({ slug: 1 }, { unique: true });
    await db.collection("categories").createIndex({ title: 1 });
    console.log("Index created for catgories collection");
  }
};

/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const down = async (db, client) => {
  await db.collection("categories").deleteMany({});
};
