if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}
console.log(process.env.SECRET) 

const express = require("express")
const app = express()
const mongoose = require("mongoose")
// const Listing = require("./models/listing.js")
// const Review = require("./models/reviews.js")
const path = require("path")
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate")
const { log } = require("console")
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema , reviewSchema} = require("./schema.js")
const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const session = require("express-session");
const MongoStore = require('connect-mongo')
const cookie = require("express-session/session/cookie.js");
const flash = require("connect-flash")

const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js")

app.set("view engine", "ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.engine('ejs',ejsMate)



app.use(express.static(path.join(__dirname,"/public")))

const dburl = process.env.ATLAS_DBURL
async function main() {
    await mongoose.connect(dburl);
}

main().then(() =>{
    console.log("connected to DB");
    
}).catch((err) =>{
    console.log(err);
})

process.on("warning", (warning) => {
  console.log(warning.stack);
});

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto : {
        secret :process.env.SECRET
    },
    touchAfter : 24*3600,
});
store.on("error",(err) =>{
    console.log("Error in express mongo store",err)
})
const sessionOption = {
    store,//or store =: store
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized : true,
    cookie: {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
}


app.use(session(sessionOption));
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser",async (req,res) =>{
//     let fakeuser = new User({
//         email : "student@gmail.com",
//         username : "delta-student",
//     })

//     let registeredUser =await User.register(fakeuser,"helloworld");
//     res.send(registeredUser);
// })

app.use("/listings" , listingRouter)
app.use("/listings/:id/reviews" , reviewRouter)
app.use("/",userRouter)

// app.get("/testListing" ,async (req,res) =>{
//     let sampleListing = new Listing({
//         title:"My new home",
//         description:"in ancient greek",
//         price: 1200,
//         location: "romania greece",
//         country:"Europe"
//     })

//     await sampleListing.save();
//     console.log("sample was saved")
//     res.send("Succesful testing")
// })



app.use((req,res,next) =>{
    next(new ExpressError(404,'page not found'))
})


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    console.log("Headers sent?", res.headersSent);

    res.status(statusCode).render("error.ejs", { err });
});

// app.use((err,req,res,next)=>{
//     // console.log("Something went wrong");
//     let{statusCode,message} = err;
//     res.status(statusCode).render("error.ejs",{err})
//     // res.status(statusCode).send(message);
//     // res.send("Something went wrong")
// })


app.listen(8080,() => {
    console.log("Server is listening to port 8080");
    
}) 