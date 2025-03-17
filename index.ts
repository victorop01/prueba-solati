import { Server } from "./src/server";
import { Common } from "./src/helper/common";

import * as dotenv from "dotenv";
dotenv.config({ path: `./environments/.${process.env.ENV || 'local'}.env` });

const server = new Server();

server.listen(port => {
  const common = new Common();
  common.showLogMessage(`Server listen in http://${process.env.HOST}:${port}`);
});

export default server;