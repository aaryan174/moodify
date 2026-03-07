const mongoose = require("mongoose")

const connectToDB = ()=>{
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("database connected succussfully");
        
    })
}


module.exports = connectToDB;