const dotenv = require('dotenv').config({
    path:'./config.env'
})
const app = require('./app')



let port = process.env.PORT 

const server = app.listen(port, () => {
    console.log("server has started on port " + port + " @ mode")

})

process.on('unhandledRejection', err => {
    server.close(()=>{
        console.log("System is Halting connection");
        
        process.exit(1)
    } )
    
})

process.on("SIGTERM", () => {
    console.log("System is Halting connection");
    server.close( () => {
    console.log("this halting")
    })
})