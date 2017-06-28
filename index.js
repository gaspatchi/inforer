import express from "express";
import config from "./config";
import init from "./lib/init";
import Consul from "consul";
import {errorHandler} from "./middlewares/validate";
import bodyparser from "body-parser";
import Metrics from "./routes/metrics";
import Info from "./routes/info";

let server = express();

server.use(bodyparser.json());
server.use(errorHandler);

server.use("/metrics", Metrics);
server.use("/", Info);


server.listen(config.server.port, config.server.address, () => {
	init();
});

process.on("SIGTERM", () => {
	let consul = Consul();
	consul.agent.service.deregister(config.server.name, () => {
		process.exit();
	});
});

process.on("SIGINT", () => {
	let consul = Consul();
	consul.agent.service.deregister(config.server.name, () => {
		process.exit();
	});
});

export default server;