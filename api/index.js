const express = require("express");
const { postgraphile } = require("postgraphile");
const { get_postgres_client_config } = require('./configurator.js');
const ConnectionFilterPlugin = require("postgraphile-plugin-connection-filter");
const app = express();

const { connectionString } = get_postgres_client_config();
console.log(`Started with ${connectionString}`)

app.use(
  postgraphile(
    connectionString,
    "public",
    {
      watchPg: true,
      graphiql: true,
      enhanceGraphiql: true,
      enableCors: true,
      retryOnInitFail: true, // not ideal, there's a delay of 5ish seconds before the postgres container finishes starting, so just retry until it succeeds
      appendPlugins: [ConnectionFilterPlugin]
    }
  )
);

app.listen(5000);
