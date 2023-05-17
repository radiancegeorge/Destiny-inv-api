import db from "./models";
import app from "./src/app";
import http from "http";
import initDashboard from "./src/dashboard";

const port = process.env.APP_PORT ?? 4000;
const server = http.createServer(app);

db.sequelize?.sync().then(async () => {
  await initDashboard(app);
  server.listen(port, console.log.bind(this, `listening on port::: ${port}`));
});
