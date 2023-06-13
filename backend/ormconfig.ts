const rootDir = 'src';

module.exports = {
	type: 'postgres',
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	synchronize: false,
	logging: false,
	entities: [`${rootDir}/databases/entities/index.{js,ts}`],
	migrations: [`${rootDir}/databases/migrations/index.{js,ts}`],
	cli: {
		entitiesDir: `${rootDir}/databases/entities`,
		migrationsDir: `${rootDir}/databases/migrations`,
	},
};
