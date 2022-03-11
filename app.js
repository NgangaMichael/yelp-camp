const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground');
const app = express();
const path = require('path');
const mathodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

// server side validation middleware logic using joi the schema is a validation schema not the original schema  
const {campgroundShema} = require('./schemas.js');
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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(mathodOverride('_method'));
app.engine('ejs', ejsMate);

// joi validation midleware 
const campgroundValidation = (req, res, next) => {
    const {error} = campgroundShema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    next()
};

// the home route 
app.get('/', (req, res) => {
    res.render('home')
});

// display all camp grounds 
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}));

// grtting the form to create camp ground 
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
});

// creating new campground and validating using joi
app.post('/campgrounds', campgroundValidation, catchAsync(async (req, res) => {
    // if(!req.body.campground) throw new ExpressError('Invalid campground data', 400)
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}));

// display single camp ground 
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id)
    res.render('campgrounds/show', {campground})
}));

// form to edit a campground 
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', {campground})
}));

// put request 
app.put('/campgrounds/:id', campgroundValidation, catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
}));

// delete a campground 
app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect(`/campgrounds`)
}));

// express error class 
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
});

// error handler middleware
app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message('Something went wrong')
    res.status(statusCode).render('error', {err})
});

// listening to port 3000 on the server 
app.listen(3000, () => {
    console.log('Serving on Port 3000')
});