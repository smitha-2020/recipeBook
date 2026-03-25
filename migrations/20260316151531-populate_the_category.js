/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const up = async (db, client) => {
  // TODO write your migration here.
  // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
  await db.collection("categories").insertMany([
    { slug: "c1", title: "Italian", color: "#f5428d" },
    { slug: "c2", title: "Quick & Easy", color: "#f54242" },
    { slug: "c3", title: "Hamburgers", color: "#f5a442" },
    { slug: "c4", title: "German", color: "#f54242" },
    { slug: "c5", title: "Light & Lovely", color: "#368dff" },
    { slug: "c6", title: "Exotic", color: "#41d95d" },
    { slug: "c7", title: "Breakfast", color: "#9eecff" },
    { slug: "c8", title: "Asian", color: "#b9ffb0" },
    { slug: "c9", title: "French", color: "#ffc7ff" },
    { slug: "c10", title: "Summer", color: "#47fced" },
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
