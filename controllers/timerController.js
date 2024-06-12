const { ObjectId } = require("mongodb");
const { nanoid } = require("nanoid");

const getTimers = async (req, res) => {
  try {
    const userId = req.user._id;
    const isActive = req.query.isActive === "true";

    const userTimers = await req.db
      .collection("timers")
      .find({ userId: new ObjectId(userId), isActive })
      .toArray();

    if (isActive) {
      userTimers.forEach((timer) => {
        timer.progress = Date.now() - new Date(timer.start).getTime();
      });
    }

    res.json(userTimers);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const createTimer = async (req, res) => {
  try {
    const { description } = req.body;
    const userId = req.user._id;

    const newTimer = {
      start: new Date(),
      description,
      isActive: true,
      id: nanoid(),
      userId: new ObjectId(userId),
    };

    await req.db.collection("timers").insertOne(newTimer);
    res.json({ id: newTimer.id });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const stopTimer = async (req, res) => {
  try {
    const userId = req.user._id;
    const id = req.params.id;

    console.log("Stopping timer with id:", id);

    const timer = await req.db
      .collection("timers")
      .findOne({ id, userId: new ObjectId(userId), isActive: true });

    if (timer) {
      timer.isActive = false;
      timer.end = new Date();
      timer.duration = timer.end.getTime() - timer.start.getTime();

      await req.db
        .collection("timers")
        .updateOne({ id, userId: new ObjectId(userId) }, { $set: timer });

      res.status(200).send({});
    } else {
      res.status(404).json({ error: "Timer not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getTimers,
  createTimer,
  stopTimer,
};
