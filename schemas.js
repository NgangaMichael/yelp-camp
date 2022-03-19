const Joi = require('joi');
const joi = require('joi')

module.exports.campgroundShema = joi.object({
    campground: joi.object({
        title: joi.string().required(),
        image: joi.string().required(),
        price: joi.number().required().min(0),
        location: joi.string().required(),
        description: joi.string().required(),
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
});