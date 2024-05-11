import {Trie,Node} from './trieStructure.js'

function jsonToNode(obj) {
  let node = new Node(obj.value);
  node.leaf = obj.leaf;
  node.wordsArray = obj.wordsArray;

  if (obj.child) {
    node.child = [];
    for (let i = 0; i < obj.child.length; i++) {
      node.child.push(jsonToNode(obj.child[i]));
    }
  }

  return node;
}

function fromJSON(json) {
  const trie = new Trie();
  trie.root = jsonToNode(json);
  return trie;
}

export {fromJSON};
