const Campground = require('./server/model/campground')
const Review = require('./server/model/review')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first')
        return res.redirect('/login')
    }
    next()
}

module.exports.isAuthor = async(req, res, next) => {
    const id = req.params.id
    const reqUser = req.body.reqUser
    const campground = await Campground.findById(id)
    if (!campground.author._id.equals(reqUser._id)) {
        return res.send('error')
    }
    next()
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const {reviewId} = req.params
    const reqUser = req.body.reqUser
    const review = await Review.findById(reviewId)
    if (!review.author._id.equals(reqUser._id)) {
        return res.send('error')
    }
    next()
}