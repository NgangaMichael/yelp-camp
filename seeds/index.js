const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
//database connection 
mongoose.connect('mongodb://localhost:27017/yelpCamp', {
    // useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected')
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++){
        const random1000 = Math.ceil(Math.random() * 1000);
        const price = Math.floor(Math.random() * 1000) + 5000;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab voluptas ad ratione repellendus nemo reprehenderit, quas molestiae animi eaque et quidem, culpa voluptatum debitis nihil! Laborum fugit magnam placeat accusantium',
            price
        })
        await camp.save()
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});

