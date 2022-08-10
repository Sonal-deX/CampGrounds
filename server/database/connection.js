const mongoose = require('mongoose')

const connectDB = async ()=>{
    try{
        // mongodb connection string
        const con = await mongoose.connect(process.env.MONGODB_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log(`MongoDB connected: ${con.connection.host}`);
    }
    catch(e){
        console.log(e);
        process.exit(1);
    }
}

module.exports = connectDB