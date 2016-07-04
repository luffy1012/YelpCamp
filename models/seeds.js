var mongoose = require("mongoose");
var Camp = require("./camp");
var Comment = require("./comments");

function seed(){
  Camp.find({},function(err,data){
    if(err){
      console.log(err);
    }
    data.forEach(function(camp){
      Comment.create({text: "This is first Comment", author: "God"},function(err,comment){
        if(err){
          console.log(err);
        }
        else{
          camp.comments.push(comment);
          camp.save();
        }
      });
    });
  });
};

module.exports = seed;
