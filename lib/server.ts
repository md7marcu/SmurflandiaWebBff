import server from "./app";
import * as env from "dotenv";
env.config();

const PORT = 5005; // process.env.SERVICE_PORT;

const srv = server.listen(PORT, () => {
    console.log("Express server listening on portt " + PORT);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${(err as any)?.message}`);
    srv.close(() => process.exit(1));
});
