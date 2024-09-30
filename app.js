if(process.env.NODE_ENV != "production"){ //fdon't upload at production level
    require('dotenv').config();
}
// console.log(process.env);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Mongo_url="mongodb://127.0.0.1:27017/wanderlust"; //will be created when a colection is added in it
const dbUrl = process.env.ATLASDB_URL;

const path = require("path")
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");

const session = require("express-session");
const MonogoStore = require("connect-mongo");
const flash = require("connect-flash");
const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const listingsRouter = require("./router/listing.js");
const reviewsRouter = require("./router/review.js");
const userRouter = require("./router/user.js");
const MongoStore = require('connect-mongo');
const { error } = require('console');

//connect to mongodb
async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs"); //^
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600,
});

store.on("error",() =>{
    console.log("Store error",err);
})

const sessionOptions = {
    store, 
    secret: process.env.SECRET, 
    resave:false, 
    saveUninitialized:true
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


main()
    .then(()=>{
        console.log("connected");
    })
    .catch((err)=>{
        console.log("error");
        
    })

app.all("*",(req,res,next)=>{    //if wrong route was searched
    next(new ExpressError(404,"Page not found!"));
});

app.use((err,req,res,next)=>{   //if err found in any route
    let{ statusCode=500, message="OOPS!!! Something went wrong"} = err;  //default answer
    console.log(err);
    res.status(statusCode).render("error.ejs",{message});
    console.log("msg:",statusCode,message)
    // res.status(statusCode).send(message); //else this
});

app.listen(8080, ()=>{
    console.log("listening to port 8080");
});

//test list
// app.get("/testListing",async(req,res) =>{
//     let sampleListing = new Listing({
//         title:"Villa",
//         description:"big",
//         price:3000,
//         location:"delhi",
//         country:"india",
//     });
//     await sampleListing.save();
//     console.log("sample");
//     res.send("success");
// });
