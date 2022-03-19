const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
// one to many relationship in schema 
const campgroundSchema = new Schema({
    title: String,
    price: Number,
    image: String,
    location: String,
    description: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',
    }]
});

// code for deleting a campground with all its reviews 
campgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        // in means checking if the reviews are inside the camp(its a mongodb method)
        await Review.deleteMany({_id: {$in: doc.reviews}})
    }
})

module.exports = mongoose.model('Campground', campgroundSchema);