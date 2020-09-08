const dotenv = require('dotenv').config({
    path:'./config.env'
})
const app = require('./app')

const mode = process.env.NODE_ENV

let port = process.env.PORT || 8080

const server = app.listen(port, () => {
    console.log("server has started on port " + port + " @ "+ mode+ " mode")

})

process.on('unhandledRejection', err => {
    server.close(()=>{
        console.log("System is Halting connection");
        
        process.exit(1)
    } )
    
})