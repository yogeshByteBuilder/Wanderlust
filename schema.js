const Joi = require("joi")

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        price : Joi.number().required().min(0),
        image : Joi.object().allow("",null),
        category : Joi.string().required().valid(
  "trending",
  "rooms",
  "iconic-cities",
  "mountains",
  "amazing-pools",
  "camping",
  "farms",
  "arctic"
),
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comments: Joi.string().required()
    }).required()
})