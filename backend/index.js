require("dotenv").config();
const PORT = process.env.PORT || 3000;
const http = require("http");
const app = require("./app");
const httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
    console.log(`Running on PORT ${PORT}`);
});
