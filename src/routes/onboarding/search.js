import { Router } from "express";
import {xyz} from "../../utils/suggestion.js";
import { Trie } from "../../utils/trieStructure.js";
import { wordTrie } from "../../utils/suggestion.js";

const router = new Router();

router.get('/api/v1/suggestion/:q',(req,res)=>{
    let trie = new Trie();
    trie = wordTrie;
    let ans = trie.search(req.params.q);
    res.send(ans);
    
})

export {router};