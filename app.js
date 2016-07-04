var express = require("express"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Camp = require("./models/camp"),
    Comment = require("./models/comments"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("./models/user"),
    flash = require("connect-flash"),
    seedDB = require("./seed");

var indexRoutes = require("./routes/index"),
    campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments");

var app = express();

mongoose.connect("mongodb://admin:JqUe5x7r2ys3@$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/yelpcamp");

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

seedDB();
/**
 * Start the server
 */

app.listen(process.env.OPENSHIFT_NODEJS_PORT,process.env.OPENSHIFT_NODEJS_IP,function(){
  console.log("Application started successfully on "+process.env.IP+":"+process.env.PORT);
});
