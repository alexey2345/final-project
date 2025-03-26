const mongoose = require("mongoose");

async function removeEmailIndex() {
  await mongoose.connect("mongodb://localhost:27017/YOUR_DATABASE_NAME", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const collection = mongoose.connection.collection("cards");
  await collection.dropIndex("email_1"); // Drops the unique index on email
  console.log("Unique index on email removed.");
  mongoose.connection.close();
}

removeEmailIndex();
