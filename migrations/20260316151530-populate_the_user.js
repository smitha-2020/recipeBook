/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const up = async (db, client) => {
  // TODO write your migration here.
  // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
  // Example:
  await db.collection("users").insertMany([
    {
      name: "Smitha",
      email: "smitha.kamath2023@gmail.com",
      password: "Smitha@123",
      isAdmin: true,
    },
    {
      name: "Prashant",
      email: "prash.bu2014@gmail.com",
      password: "prash@123",
    },
    {
      name: "Harshada",
      email: "harshada.bhandarkar@gmail.com",
      password: "harshada@123",
    },
    {
      name: "Anup",
      email: "anup.kamath@gmail.com",
      password: "anup@123",
    },
  ]);
};

/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const down = async (db, client) => {
  // TODO write the statements to rollback your migration (if possible)
  // Example:
  await db.collection("users").deleteMany({});
};
