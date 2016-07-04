var express = require("express");
var Camp = require("../models/camp");
var Comment = require("../models/comments");

var router = express.Router({mergeParams:true});

/**
 * Add new comment
 */
router.post("",isLoggedIn,function(req,res){
  Camp.findOne({_id:req.params.id},function(err,camp){
    if(err){
      console.log(err);
      req.flash("error","Error while creating comment. Please try again.")
      res.redirect("/campgrounds/");
    }
    else{
      var comment = req.body.comment;
      var keys = ["text"];
      var isValid = true;
      keys.forEach(function(key){
        if (!(key in comment && typeof(comment[key])==="string" && comment[key] !== "")){
          isValid = false;
        }
        else{
          comment[key] = req.sanitize(comment[key]);
        }
      });
      comment.author = {username: req.user.username, id: req.user._id};
      if(isValid){
        Comment.create(comment,function(err,comment){
          if(err){
            req.flash("error","Error while creating comment. Please try again.")
            console.log(err);
          }
          else{
            camp.comments.push(comment);
            camp.save();
          }
          res.redirect("/campgrounds/"+req.params.id+"/");
        });
      }
      else{
        req.flash("error","You are not authorized to do this.");
        res.redirect("/campgrounds/"+req.params.id+"/");
      }
    }
  });
});

/**
 * Edit a comment
 */
router.put("/:commentId",isLoggedIn,function(req,res){
  Comment.findOne({_id:req.params.commentId},function(err,comment){
    if(err){
      console.log(err);
      req.flash("error","Error while editing the comment. Please try again.");
      res.redirect("back");
    }
    else if(req.user._id.toString() === comment.author.id.toString()){
      if(req.body.comment && req.body.comment!==""){
        comment.text = req.body.comment;
        comment.save(function (err,comment) {
          res.redirect("back");
        });
      }
      else{
        res.redirect("back");
        req.flash("error","Comment can't be empty.");
      }
    }
    else{
      req.flash("error","You are not authorized to do this.");
      res.redirect("/campgrounds/"+req.params.id+"/");
    }
  });
});

/**
 * Delete a comment
 */
router.delete("/:commentId",isLoggedIn,function(req,res){
  Comment.findOne({_id:req.params.commentId},function(err,comment){
    if(err){
      console.log(err);
      req.flash("error","Error while deleting the comment. Please try again.");
      res.redirect("back");
    }
    else if(req.user._id.toString() === comment.author.id.toString()){
      comment.remove(function(err){
        if(err){
          req.flash("error","Error while deleting the comment. Please try again.");
          console.log(err);
        }
        res.redirect("/campgrounds/"+req.params.id+"/");
      });
    }
    else{
      req.flash("error","You are not authorized to perform this action.");
      res.redirect("/campgrounds/"+req.params.id+"/");
    }
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error","Please Login first!");
  res.redirect("/login");
}

module.exports = router;
