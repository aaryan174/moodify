require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/database");


connectToDB();
app.listen(8080, ()=>{
    console.log("server is running on port 8080")
    
})