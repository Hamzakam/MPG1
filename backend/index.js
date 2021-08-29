//initialises and runs a server on specified port.
//Uses app(express()) for creating said server

require("dotenv").config();
const http = require("http");
const app = require("./app");
const httpServer = http.createServer(app);

const PORT = process.env.PORT;

httpServer.listen(PORT, () => {
    console.log(`Running on PORT ${PORT}`);
});
