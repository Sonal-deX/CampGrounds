const axios = require('axios');

// make a request to laod new.ejs 
exports.newEJSroute = (req, res) => {
    res.render('campground/new.ejs')
}

// home.ejs
exports.home = (req, res) => {
    res.render('home.ejs')
}

// Make a request to createAPI/campground
exports.createCampground = (req, res) => {
    const newObj = req.body.campground
    const newArray = req.files
    const reqUser = req.user
    axios({
        method: 'post',
        url: `${process.env.LINK}/api/campgrounds`,
        headers: {},
        data: {
            newObj,
            newArray,
            reqUser // This is the body part
        }
    })
        .then((response) => {
            req.flash('success', 'Successfully created a new campground ')
            res.redirect(`/campgrounds/${response.data._id}`);
        })
        .catch((err) => {
            console.log(err);
        })
}

// Make a request to findAPI/campground
exports.homeCampground = (req, res) => {

    axios.get(`${process.env.LINK}/api/campgrounds`)
        .then((response) => {
            res.render('campground/index', { campgrounds: response.data })
        })
        .catch((err) => {
            res.status(err.response.status).render('error', { err: err.response.statusText, errCode: err.response.status })
        })

}

// Make a request to find campground with id 
exports.campground = (req, res) => {
    axios.get(`${process.env.LINK}/api/campgrounds/${req.params.id}`)
        .then((response) => {
            res.render('campground/show', { campground: response.data });
        })
        .catch((err) => {
            res.status(err.response.status).render('error', { err: err.response.statusText, errCode: err.response.status })
        })
}


// make a request to updateAPI/campground
exports.updateCampground = (req, res) => {
    const id = req.params.campid
    const newArray = req.files
    const reqUser = req.user
    const updateObj = req.body.campground
    delete updateObj.id
    axios({
        method: 'put',
        url: `${process.env.LINK}/api/campgrounds/${id}`,
        headers: {},
        data: {
            updateObj,
            newArray,
            reqUser,
            delimg:req.body.deleteImages // This is the body part
        }
    })
        .then((response) => {
            if (response.data == 'error') {
                req.flash('error', 'You do not have permission to do that')
                res.redirect(`/campgrounds/${id}`)
            } else {
                req.flash('success', 'Successfully updated campground ')
                res.redirect(`/campgrounds/${response.data._id}`)
            }
        })
        .catch((err) => {
            res.status(err.response.status).render('error', { err: err.response.statusText, errCode: err.response.status })
        })
}

// Make a request to deleteAPI/campground
exports.deleteCampground = (req, res) => {
    const id = req.params.campid
    const reqUser = req.user
    axios({
        method: 'delete',
        url: `${process.env.LINK}/api/campgrounds/${id}`,
        headers: {},
        data: {
            reqUser// This is the body part 
        }
    })
        .then((response) => {
            if (response.data == 'error') {
                req.flash('error', 'You do not have permission to do that')
                res.redirect(`/campgrounds/${id}`)
            } else {
                req.flash('success', 'Successfully deleted campground ')
                res.redirect('/campgrounds')
            }

        })
        .catch((err) => {
            res.status(err.response.status).render('error', { err: err.response.statusText, errCode: err.response.status })
        })
}

// Make a request to createAPI/review
exports.createReview = (req, res) => {
    const id = req.params.campid
    const reqUser = req.user
    const reviewObj = req.body.review
    axios({
        method: 'post',
        url: `${process.env.LINK}/api/campgrounds/${id}/reviews`,
        headers: {},
        data: {
            reviewObj,
            reqUser // This is the body part 
        }
    })
        .then((response) => {
            res.redirect(`/campgrounds/${response.data._id}`)
        })
        .catch((err) => {
            res.status(err.response.status).render('error', { err: err.response.statusText, errCode: err.response.status });
        })
}

// Make a request to deleteAPI/review
exports.deleteReview = (req, res) => {
    const { campid, reviewId } = req.params
    const reqUser = req.user
    axios({
        method: 'delete',
        url: `${process.env.LINK}/api/campgrounds/${campid}/reviews/${reviewId}`,
        headers: {},
        data: {
            reqUser// This is the body part 
        }
    })
        .then((response) => {
            if (response.data == 'error') {
                req.flash('error', 'You do not have permission to do that')
                res.redirect(`/campgrounds/${campid}`)
            } else {
                req.flash('success', 'Successfully deleted Review ')
                res.redirect(`/campgrounds/${campid}`)
            }
            
        })
        .catch((err) => {
            res.status(err.response.status).render('error', { err: err.response.statusText, errCode: err.response.status });
        })
}

// Make a request to load user.ejs
exports.userEJSroute = (req, res) => {
    res.render('users/register.ejs')
}

// Make a request to load login.ejs
exports.loginEJSroute = (req, res,) => {
    res.render('users/login.ejs')
}