/*
 * initialises and runs a server on specified port.
 * Uses app(express()) for creating said server
 */

const config = require("./utils/config");
const http = require("http");
const app = require("./app");
const httpServer = http.createServer(app);
const logger = require("./utils/logger");
const PORT = config.PORT;

httpServer.listen(PORT, () => {
    logger.info(`Running on PORT ${PORT}`);
});
