require("dotenv").config({ path: "./variables.env" });

const { DB_URL_DEV, DB_PORT, RPC_NODE_URL, DB_URL_PROD, ENVIRONMENT } =
  process.env;

console.log("DB_URL_DEV", DB_URL_PROD);

module.exports = {
  DATABASE_URL: ENVIRONMENT === "production" ? DB_URL_PROD : DB_URL_DEV,
  DATABASE_ENVIRONMENT: ENVIRONMENT,
  DATABASE_PORT: DB_PORT,
  RPC_NODE_URL,
};
