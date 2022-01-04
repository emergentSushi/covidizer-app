var yaml_config = require('node-yaml-config');

module.exports = {
    get_postgres_client_config: (env) => {
        env = env ?? process.env.ENV;
        config = yaml_config.load(`config.${env}.yaml`);

        return {
            connectionString: `postgresql://${config.user}:${config.password}@${config.host}:${config.port ?? 5432}/covid_stats`
        };
    }
};
