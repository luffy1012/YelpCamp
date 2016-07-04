var express = require("express");
var Camp = require("../models/camp");
var router = express.Router();
var User = require("../models/user");
/**
 * Render all campgrounds
 */
router.get("",function(req,res){
	Camp.find({},function(err,camps){
		if(err){
			req.flash("error","Error while fetching campgrounds. Please try again.");
			console.log(err);
			res.redirect("/")
		}
		else{
			res.render("campgrounds",{camps:camps});
		}
	});
});

/**
 * Create a new campground
 */
router.post("",isLoggedIn,function(req,res){
	var isValid = true;
	var camp = {};
	keys = ["name","src","desc"];
	for(var i=0;i<keys.length;i++){
		if (!(keys[i] in req.body && req.body[keys[i]] !== "")){
			isValid = false;
			break;
		}
		camp[keys[i]] = req.body[keys[i]];
	}
	if (isValid){
		camp.desc = req.sanitize(camp.desc);
		Camp.create(camp,function(err,camp){
			camp.author.id = req.user._id;
			camp.author.username = req.user.username;
			camp.save();
			if (err){
				req.flash("error","Error while creating campgrounds. Please try again.");
				console.log(err);
				res.redirect("/campgrounds/new");
			}
			else{
				req.flash("success","Campground successfully created.");
				res.redirect("/campgrounds");
			}
		});
	}
	else{
		req.flash("error","All fields are mandatory. Please try again.");
		res.redirect("/campgrounds/new");
	}
});


/**
 * Display form for making new campground
 */

router.get("/new",isLoggedIn,function(req,res){
	res.render("newCampground");
});


/**
 * display details of a campground
 */
router.get("/:id",function(req,res){
	Camp.findOne({_id: req.params.id}).populate("comments").exec(function(err,camp){
		if(err){
			req.flash("error","Error while fetching the campground. Please try again.");
			res.redirect("/campgrounds/");
		}
		else{
			res.render("campground",{camp:camp});
		}
	});
});

/**
 * Edit info of a campground
 */
router.put("/:id",isLoggedIn,isCreator,function(req,res) {
	Camp.findOne({ _id: req.params.id }, function (err, camp){
		if(err){
			req.flash("error","Error while fetching the campground. Please try again.");
			res.redirect("/campgrounds/"+req.params.id+"/edit/");
		}
		else if(isCreator(req,camp)){
			var isValid = true;
			keys = ["name","src","desc"];
			for(var i=0;i<keys.length;i++){
				if (!(keys[i] in req.body && req.body[keys[i]] !== "")){
					isValid = false;
					break;
				}
				camp[keys[i]] = req.body[keys[i]];
			}
			if (isValid){
				camp.desc = req.sanitize(camp.desc);
				camp.save();
				req.flash("success","Edit successful.");
				res.redirect("/campgrounds/"+req.params.id+"/");
			}
			else{
				req.flash("error","All fields are mandatory. Please try again.");
				res.redirect("/campgrounds/"+req.params.id+"/edit/");
			}
		}
		else{
			req.flash("error","You are not authorized to perform this action.");
			res.redirect("/campgrounds/"+req.params.id+"/");
		}
	});
});

/**
 * remove a campground
 */

router.delete("/:id",isLoggedIn,function(req,res){
	Camp.findOne({_id: req.params.id}, function(err,camp){
		if(err){
			req.flash("error","Error while fetching the campground. Please try again.");
			console.log(err);
			res.redirect("/campgrounds/");
		}
		else if(isCreator(req,camp)){
			camp.remove();
			req.flash("success","Deletion successful.");
			res.redirect("/campgrounds/");
		}
		else{
			req.flash("error","You are not authorized to perform this action.");
			res.redirect("/campgrounds/"+req.params.id+"/");
		}
	});
});

/**
 * display edit form of a campground
 */

router.get("/:id/edit",isLoggedIn,function(req,res){
	Camp.findOne({_id: req.params.id},function(err,camp){
		if(err){
			req.flash("error","Error while fetching the campground. Please try again.");
			console.log(err);
			res.redirect("/campgrounds/");
		}
		else if(isCreator(req,camp)){
			res.render("editCamp",{camp:camp});
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
	req.flash("error","Please Login first.");
  res.redirect("/login/");
}


module.exports = router;

function isCreator(req,camp) {
		return req.user._id.toString() === camp.author.id.toString();
}
