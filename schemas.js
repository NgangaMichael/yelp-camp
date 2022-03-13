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

module.exports.ReviewSchema = Joi.object({
    Review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().min(1).max(5)
    }).required()
});