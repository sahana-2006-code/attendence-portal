
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);import app from "./app.js";
import connectDB from "./config/database.js";
import env from "./config/env.js";

const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
  });
};

startServer();