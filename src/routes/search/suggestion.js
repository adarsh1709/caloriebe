import { Router } from "express";
import { getTrie } from "../../utils/searchQueries.js";
const router = new Router();

router.get("/api/v1/getJson", async (req, res) => {
  let result =await getTrie();
  return res.json(result.rows)
});

export { router };
