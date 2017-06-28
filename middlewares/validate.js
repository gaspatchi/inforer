import Ajv from "ajv";
import Localize from "ajv-i18n";

let ajv = new Ajv({ allErrors: true });

const search = {
	"$async": true,
	"required": ["query"],
	"properties": {
		"query": { "type": "string" }
	}
};

ajv.addSchema(search, "search");

export function JsonValidate(options) {
	return async (req, res, next) => {
		try {
			await ajv.validate(options, req.body);
			next();
		} catch (error) {
			Localize.ru(error.errors);
			res.status(400).json(error.errors);
		}
	};
}

export function errorHandler(error, req, res, next) {
	if (error instanceof SyntaxError) {
		res.status(400).json({ message: "Ошибка при обработке запроса" });
	} else {
		next();
	}
}