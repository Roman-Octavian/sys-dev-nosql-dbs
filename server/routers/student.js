import { Router } from "express";
import { database }  from "../database/connection.js";

const router = Router();

router.get("/api/v1/student", async (req, res) => {
  try {
    return res.status(200).send({});
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: e });
  }
});

router.get("/api/v1/student/:name", async (req, res) => {
  try {
    return res.status(200).send({});
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: e });
  }
});

export default router;
