
const Redis = require("ioredis").default


const redis = new Redis({
    host: process.env.REDIS_URI,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
})

redis.on("connect", ()=>{
    console.log("server is connected to redis vohoo");
})


redis.on("error", (err)=>{
    console.log(err);
    
})


module.exports = redis