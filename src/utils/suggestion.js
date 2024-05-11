import { Router } from "express";
import { getTrie } from "./searchQueries.js";
import { fromJSON } from "./trieJsonConverter.js";
import { Trie } from "./trieStructure.js";
const router = new Router();

let wordTrie = new Trie();

const xyz = async function(){
  let result =await getTrie();
  wordTrie = fromJSON(result.rows[0]["json"]);
}

export { router, xyz,wordTrie };
