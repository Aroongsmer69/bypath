import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer();
app.use((req, res, next) => {
res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
next();
});
app.use(express.static(join(__dirname, "public")));
app.use("/scramjet", express.static(join(__dirname, "node_modules/@mercuryworkshop/scramjet/dist")));
app.use("/baremux", express.static(join(__dirname, "node_modules/@mercuryworkshop/bare-mux/dist")));
app.use("/epoxy", express.static(join(__dirname, "node_modules/@mercuryworkshop/epoxy-transport/dist")));
server.on("request", (req, res) => {
app(req, res);
});
server.on("upgrade", (req, socket, head) => {
if (req.url.endsWith("/wisp/")) {
wisp.routeRequest(req, socket, head);
} else {
socket.end();
}
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
console.log("BYPATH running on port " + PORT);
});
