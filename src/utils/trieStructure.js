
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
export function Node(value){
    this.value=value;
    this.child=[];
    this.leaf=false 
    this.wordsArray=[]
}

export class Trie {
  constructor() {
    this.root = new Node(null);
  }

  insert(name) {
    let current = this.root;
    for (let i = 0; i < name.length; i++) {
      let flag = false;
      current.child.forEach((element) => {
        if (name[i] == element.value) {
          current = element;
          current.wordsArray.forEach((word) => {
            if (name == word) {
              return;
            }
          });

          current.wordsArray.push(name);
          if (current.wordsArray.length > 5) {
            current.wordsArray.shift();
          }
          flag = true;
        }
      });
      if (!flag) {
        let newNode = new Node(name[i]);
        current.child.push(newNode);
        current = newNode;
        current.wordsArray.push(name);
      }
    }
    current.leaf = true;
    return name;
  }

  search(word) {
    let current = this.root;
    for (let i = 0; i < word.length; i++) {
      let flag = false;
      current.child.forEach((element) => {
        if (word[i] == element.value) {
          current = element;
          flag = true;
        }
      });
      if (!flag) return null;
    }
    return current.wordsArray;
  }

  toJSON() {
    return this.rootToJSON(this.root);
  }

  rootToJSON(node) {
    let obj = {};
    obj.value = node.value;
    obj.leaf = node.leaf;
    obj.wordsArray = node.wordsArray;

    if (node.child.length > 0) {
      obj.child = [];
      for (let i = 0; i < node.child.length; i++) {
        obj.child.push(this.rootToJSON(node.child[i]));
      }
    }

    return obj;
  }
  
}








