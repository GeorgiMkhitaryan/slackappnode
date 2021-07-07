const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./Routes/authRouter");
const homeRouter = require("./Routes/homeRouter");
const PORT = process.env.PORT || 5000;
// const subdomain = require("express-subdomain");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/auth", authRouter);
app.use("/home", homeRouter);

const start = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://slackApp:ZV5wUDMYVZAt3khK@cluster0.utizo.mongodb.net/slack_app?retryWrites=true&w=majority`
    );
    app.listen(PORT, () => console.log(`server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
