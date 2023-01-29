import config from "config";
import connect from "./utils/connect";
import logger from "./utils/logger";
import createServer from "./utils/server";
import swaggerDocs from "./utils/swagger";

const port = config.get<number>("port");

const app = createServer();

app.listen(port, async () => {
  logger.info(`This app is running on https://localhost:${port}`);

  await connect();

  // Start the swagger docs.
  swaggerDocs(app, port);
});
