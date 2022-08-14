const Campground = require('../model/campground')
const Review = require('../model/review')
const catchAsync = require('../error/catchAsync')

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mbToken = process.env.MAPBOX_TOKEN
const geoCoder = mbxGeocoding({ accessToken: mbToken })

// retrieve and return all users/ retrieve and return single user
exports.findCampground = catchAsync(async (req, res) => {
    const campgrounds = await Campground.find()
    res.send(campgrounds)

})

exports.findCampgroundById = catchAsync(async (req, res) => {
    const id = req.params.id
    Campground.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author')
        .then((data) => {
            if (!data) {
                res.status(404).send({ message: `Cannot found user with ${id}.Maybe user not found!` })
            } else {
                res.send(data)
            }
        })
        .catch((err) => {
            res.status(404).send({ message: `Error retrieving user with id:${id}` })
        })
})

exports.createCampground = catchAsync(async (req, res) => {
    const location = req.body.newObj.location
    const state = req.body.newObj.state
    const geoData = await geoCoder.forwardGeocode({
        query:`${location}, ${state}`,
        limit: 1
    }).send()
    console.log();
    const campground = new Campground(req.body.newObj)
    campground.geometry = geoData.body.features[0].geometry
    campground.img = req.body.newArray.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.body.reqUser._id
    const respond = await campground.save()
    console.log(campground);
    res.send(respond)
})

exports.updateCampground = catchAsync(async (req, res) => {
    const id = req.params.id
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.updateObj })
    const imgs = req.body.newArray.map(f => ({ url: f.path, filename: f.filename }))
    camp.img.push(...imgs)
    const respond = await camp.save()
    return res.send(respond)

})

exports.deleteCampground = catchAsync(async (req, res) => {
    const id = req.params.id
    const respond = await Campground.findByIdAndDelete(id)
    return res.send(respond)
})

exports.createReview = catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = await new Review(req.body.reviewObj)
    review.author = req.body.reqUser
    campground.reviews.push(review)
    await review.save()
    const response1 = await campground.save()
    res.send(response1)
})


exports.deleteReview = catchAsync(async (req, res) => {
    const { campid, reviewId } = req.params
    const response1 = await Campground.findByIdAndUpdate(campid, { $pull: { reviews: reviewId } })
    const response2 = await Review.findByIdAndDelete(reviewId)
    res.send(response1)
})

