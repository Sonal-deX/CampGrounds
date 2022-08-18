const express = require('express');
const route = express.Router();
const passport = require('passport')

const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })
const { cloudinary } = require('../cloudinary');

const services = require('../services/render')
const controller = require('../controller/controller')
const login = require('../controller/login')
const { isLoggedIn, isAuthor, isReviewAuthor,imgCheckAtCreate,imgCheckAtUpdate } = require('../../middleware')

const { validateCampground, validateReview } = require('../error/validate')

/**
 * @description home.ejs 
 * @GET
 */
route.get('/',services.home)

/**
 * @description new.ejs campground Route
 * @GET
 */
route.get('/campgrounds/new', isLoggedIn, services.newEJSroute)

/**
 * @description Root Route
 * @GET
 */
route.get('/campgrounds', services.homeCampground)

/**
 * @description find campground Route
 * @GET
 */
route.get('/campgrounds/:id', services.campground)

/**
 * @description New campground Route
 * @POST
 */

route.post('/campgrounds/new', isLoggedIn, upload.array('campground[img]'),imgCheckAtCreate,validateCampground ,services.createCampground)

/**
 * @description update campground Route
 * @post
 */
route.post('/campgrounds/:campid/edit', isLoggedIn, upload.array('campground[img]'),imgCheckAtUpdate,validateCampground, services.updateCampground)

/**
 * @description delete campground Route
 * @post
 */
route.post('/campgrounds/:campid/delete', isLoggedIn, services.deleteCampground)

/**
 * @description New riview Route
 * @POST 
 */
route.post('/campgrounds/:campid/reviews', isLoggedIn, validateReview, services.createReview)

/**
 *@description delete riview Route
 @POST
 */
route.post('/campgrounds/:campid/reviews/:reviewId', isLoggedIn, services.deleteReview)

/**
 * @description New user.ejs(userRegister) Route
 * @GET 
 */
route.get('/register', services.userEJSroute)

/**
 * @description User Login(login.ejs) Route
 * @GET 
 */
route.get('/login', services.loginEJSroute)


// API routes
route.post('/api/campgrounds', controller.createCampground)
route.get('/api/campgrounds', controller.findCampground)
route.get('/api/campgrounds/:id', controller.findCampgroundById)
route.put('/api/campgrounds/:id', isAuthor, controller.updateCampground)
route.delete('/api/campgrounds/:id', isAuthor, controller.deleteCampground)
route.post('/api/campgrounds/:id/reviews', controller.createReview)
route.delete('/api/campgrounds/:campid/reviews/:reviewId', isReviewAuthor, controller.deleteReview)

// login,logout and createUser routes
route.post('/register', login.createUser)
route.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), login.loginUser)
route.get('/logout', login.logoutUser)



module.exports = route