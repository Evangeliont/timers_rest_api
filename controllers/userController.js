const { ObjectId } = require("mongodb");
const { hash } = require("../helpers/cryptoHelper");
const { createSession, deleteSession } = require("../helpers/sessionsMethods");

const signup = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!password) {
      return res.status(400).send("Password is required");
    }

    const newUser = {
      _id: new ObjectId(),
      username,
      password: hash(password),
    };
    await req.db.collection("users").insertOne(newUser);
    res.status(200).redirect("/");
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await req.db.collection("users").findOne({ username });
    if (!user || user.password !== hash(password)) {
      return res.redirect("/?authError=true");
    }

    const sessionId = await createSession(req.db, user._id);

    res.cookie("sessionId", sessionId, { httpOnly: true }).redirect("/");
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect("/");
    }

    await deleteSession(req.db, req.sessionId);
    res.clearCookie("sessionId").redirect("/");
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  signup,
  login,
  logout,
};
