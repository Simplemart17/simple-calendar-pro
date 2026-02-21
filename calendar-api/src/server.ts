import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { log } from "./lib/logger.js";

const app = createApp();

app.listen(env.PORT, () => {
  log({
    level: "info",
    message: `calendar-api listening on port ${env.PORT}`,
    context: {
      env: env.NODE_ENV
    }
  });
});
