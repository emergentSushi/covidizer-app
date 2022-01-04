const { Client } = require("pg");
const parse = require("csv-parse");
const getStream = require("get-stream");
const moment = require("moment");
const fs = require("fs");

const { get_postgres_client_config } = require("./configurator.js");

readCSVData = async (filePath) => {
	const data = await getStream.array(fs.createReadStream(filePath).pipe(parse({ delimiter: "," })));
	return data.map((line) => line.join(",")).join("\n");
};

const load_test_data = async (csv_path) => {
	console.log(`Loading data from csv '${csv_path}'`);
	/*
        csv schema
        2 - Indicator
        3 - Series
        4 - Sub Series
        5 - event date
        6 - event value
    */

	const lines = await getStream.array(fs.createReadStream(csv_path).pipe(parse({ delimiter: ",", from_line: 2 })));

	const csvData = lines.map((row) => {
		return {
			indicator: row[2],
			series: row[3],
			sub_series: row[4],
			date: row[5],
			value: row[6],
		};
	});
	console.log(`Completed loading data from csv '${csv_path}'`);
	return csvData;
};

const create_schema = async (client) => {
	var sql = fs.readFileSync("create_schema.sql").toString();
	console.log("Creating schema...");
	await client.query(sql).catch((e) => {
		console.error("Error creating schema", e);
		process.exitCode = 1;
		process.kill();
	});
	console.log("Schema created");
};

const store = async (csvData, client) => {
	console.log("Loading test data...");
	let indicators = [];
	let series = [];
	let sub_series = [];

	try {
		const insertFn = async (entries, local_store, insert_query) => {
			let result = await client.query(insert_query, entries);
			local_store[entries[0]] = result.rows[0].id;
		};

		for (let i = 0; i < csvData.length; i++) {
			const currentRecord = csvData[i];

			if (!indicators[currentRecord.indicator]) {
				await insertFn(
					[currentRecord.indicator],
					indicators,
					"INSERT INTO indicator(name) VALUES($1) RETURNING id"
				);
			}

			if (!series[currentRecord.series]) {
				await insertFn(
					[currentRecord.series, indicators[currentRecord.indicator]],
					series,
					"INSERT INTO series(name, indicator_id) VALUES($1, $2) RETURNING id"
				);
			}

			if (!sub_series[currentRecord.sub_series]) {
				await insertFn(
					[currentRecord.sub_series, series[currentRecord.series]],
					sub_series,
					"INSERT INTO sub_series(name, series_id) VALUES($1, $2) RETURNING id"
				);
			}

			if (isNaN(parseInt(currentRecord.value))) {
				console.log(`Invalid record, expected int, found '${currentRecord.value}', skipping...`);
				continue;
			}

			await client.query(
				"INSERT INTO event(indicator_id, series_id, sub_series_id, date, value) VALUES($1, $2, $3, $4, $5)",
				[
					indicators[currentRecord.indicator],
					series[currentRecord.series],
					sub_series[currentRecord.sub_series],
					moment(currentRecord.date, "DD/MM/YYYY").format("YYYY-MM-DD"), // postgres assumes US format, shift it to ISO-8601 to remove abiguity
					currentRecord.value,
				]
			);
		}
	} catch (err) {
		console.log("Error while Connecting DB !", err);
	}
	console.log("Completed loading test data");
};

(async () => {
	try {
		let client = new Client(get_postgres_client_config("dev"));
		await client.connect();
		await create_schema(client);
		const csvData = await load_test_data("./covid_19_new_zealand.csv");
		await store(csvData, client);

		// clumsy, but we have to self-destruct here because we can't await at the top level and I don't want to use promises
		process.exitCode = 0;
		process.kill();
	} catch (e) {
		console.log(e);
	}
})();
