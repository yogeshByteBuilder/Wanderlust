if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));

const dbUrl = process.env.ATLAS_DBURL;

async function startServer(){

    // 1️⃣ CONNECT DB
    await mongoose.connect(dbUrl);
    console.log("✅ MongoDB connected");

    // 2️⃣ CREATE STORE
    const store = MongoStore.create({
  mongoUrl: process.env.ATLAS_DBURL,
  secret: process.env.SECRET,
  touchAfter: 24 * 3600
});

    store.on("error",(err)=>{
        console.log("SESSION STORE ERROR",err);
    });

    // 3️⃣ SESSION
    app.use(session({
        store,
        secret: process.env.SECRET,
        resave:false,
        saveUninitialized:false,
        cookie:{
            maxAge:1000*60*60*24*7,
            httpOnly:true
        }
    }));

    app.use(flash());

    // 4️⃣ PASSPORT
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    // 5️⃣ GLOBAL LOCALS
    app.use((req,res,next)=>{
        res.locals.success=req.flash("success");
        res.locals.error=req.flash("error");
        res.locals.currUser=req.user;
        next();
    });

    // 6️⃣ ROUTERS
    app.get("/", (req, res) => {
    res.redirect("/listings");
});

    app.use("/listings", listingRouter);
    app.use("/listings/:id/reviews", reviewRouter);
    app.use("/", userRouter);

    // 7️⃣ START SERVER
    app.listen(8080,()=>{
        console.log("🚀 Server running on port 8080");
    });
}

startServer().catch(err=>console.log(err));