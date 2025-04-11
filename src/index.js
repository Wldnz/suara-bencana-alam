require("dotenv/config.js");
const Hapi = require("@hapi/hapi");
const routes = require("./routes");
const Connection = require("./config/connection");
const storage = new Connection();
const init = async () => {
    const server = Hapi.server({
        host : process.env.ENVIROMENT_MODE === "production"? "api-suara-bencana-alam.vercel.app" : "localhost",
        port : 3000,
        routes : {
            cors : {
                origin : ["*"],
                credentials : true
            }
        },
    });

    server.state("personal-token",{
        ttl : (60 * 60 * 24 * 3) * 1000, // 3 hari
        isSecure : true,
        isHttpOnly : true,
        encoding : "iron",
        password : process.env.SECRET_HASH,
        clearInvalid : true, // in client side when cookie invalid it well destroy it,
        strictHeader : true,
        path : "/"
    });

    server.ext("onRequest", function (request,h){
        console.log(`GET REQUEST FROM ${request.headers.referer? request.headers.referer : "OUT BROWSER"}`);
        return h.continue;
    });

    setInterval(() =>{
        storage.deleteNonActiveImage();
        storage.deleteNonActiveToken();
    },30000)

    server.route(routes);
    server.start();
    console.log("RUNNING SERVER ON PORT 3000 ALSO MODE="+process.env.ENVIROMENT_MODE);
}

init();
