const mongoose = require('mongoose')
const Review = require('./review')

const campgroundSchema = new mongoose.Schema({
    title: {
        type: 'string',
        required: true
    },
    img: String,
    price: {
        type: 'number',
        required: true
    },
    description: String,
    location: {
        type: 'string',
        required: true
    },
    state: {
        type: 'string',
        required: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', campgroundSchema)