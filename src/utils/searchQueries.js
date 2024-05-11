import { postgresClient } from "../../lib/db_setup.js";

const setInsertData=async function (json) {    
  return await postgresClient.query("INSERT INTO suggestionTrie (json) VALUES ($1)", [
    json,
  ]);
}

const getTrie =async function () {
  let result=await postgresClient.query("select json from suggestionTrie limit 1");
  return result;
};

export {getTrie,setInsertData}
