import { Router } from "express";
import { database } from "../database/connection.js";

const router = Router();

router.get("/api/v1/topic", async (req, res) => {
  try {
    const topics = await database.collection('topic').find().toArray();
    return res.status(200).send(topics);
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: e });
  }
});

export default router;
