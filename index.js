require("dotenv").config();
const express = require("express");
const connectMiddleware = require("./middlewares/connectMiddleware");
const nunjucks = require("nunjucks");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const renderRouter = require("./routes/renderRouter");
const userRouter = require("./routes/usersRouter");
const timersRouter = require("./routes/timersRouter");

const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app,
  tags: {
    blockStart: "[%",
    blockEnd: "%]",
    variableStart: "[[",
    variableEnd: "]]",
    commentStart: "[#",
    commentEnd: "#]",
  },
});

app.set("view engine", "njk");

app.use(connectMiddleware);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan("dev"));

app.use("/", renderRouter, userRouter);
app.use("/api/timers", timersRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
