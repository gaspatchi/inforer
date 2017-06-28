import TarantoolConnection from "tarantool-driver";
import config from "../config";

class Tarantool {
	async _connect() {
		let connection = new TarantoolConnection(config.tarantool);
		await connection.connect();
		await connection.auth(config.tarantool.user, config.tarantool.password);
		return connection;
	}

	async selectImage(image) {
		let connection = await this._connect();
		let response = await connection.call("selectImage", image);
		return response;
	}
}

export default new Tarantool;