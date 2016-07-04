var express = require("express"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Camp = require("./models/camp"),
    Comment = require("./models/comments"),
    seed = require("./models/seeds"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("./models/user");
    flash = require("connect-flash");

var indexRoutes = require("./routes/index"),
    campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments");

var app = express();

mongoose.connect("mongodb://localhost/yelpcamp");

app.use(flash());
app.use(require("express-session")({
  secret: "I will become a legendary programmer and change the world.",
  resave: false,
  saveUninitialized: false,
}));


app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Adding currentUser to local variables in templates
app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.set("view engine", "ejs");

/**
 * Routes
 */
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

/**
 * Start the server
 */

// User.findOne({"username":"God"},function(err,user){
//   Camp.find({},function(err,camps){
//     camps.forEach(function (camp) {
//       camp.author.id = user._id;
//       camp.author.username = user.username;
//       camp.save();
//     });
//   });
// });

app.listen(process.env.PORT,process.env.IP,function(){
  console.log("Application started successfully on "+process.env.IP+":"+process.env.PORT);
});
