
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;
const Schema = mongoose.Schema;
//defines username and password automatically
const userSchema = new Schema({
    email : {
        type : String,
        required : true,
    },

})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema)