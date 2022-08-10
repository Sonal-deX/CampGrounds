const User = require('../model/user')
const catchAsync = require('../error/catchAsync')


exports.createUser = catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp')
            res.redirect('/campgrounds')
        })
    }
    catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
})

exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome back!')
    res.redirect('/campgrounds')
}

exports.logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('success', 'successfully logged out')
        res.redirect('/campgrounds')
    });
}