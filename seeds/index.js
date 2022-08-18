const mongoose = require('mongoose')
const Campground = require('../server/model/campground')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const dotenv = require('dotenv')

dotenv.config()

mongoose.connect('mongodb+srv://sonal2002:Lasintha2002@cluster0.xy0gjjg.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection
db.on("error", console.error.bind(console, "Connection error"))
db.once("open", () => {
    console.log("Database connection successful")
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const seeddb = async () => {
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: '62fa9dfe0f55b799d1b7b92f',
            location: `${cities[random1000].city}`,
            geometry:{
                type: 'Point',
                coordinates:[cities[random1000].longitude,cities[random1000].latitude]
            },
            state: `${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio, ad in eum numquam laborum ab sequi modi possimus vero quaerat magnam ipsa debitis cum beatae atque ut delectus tempore iure?',
            price,
            img: [
                {
                    url: 'https://res.cloudinary.com/dujxnzkly/image/upload/v1660809854/YelpCamp/n2nnqf1iy0ghl2tccoed.jpg',
                    filename: 'YelpCamp/n2nnqf1iy0ghl2tccoed',
                }
            ]
        })
        await camp.save()
    }
}

seeddb()