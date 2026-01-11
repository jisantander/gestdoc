require("dotenv").config();
const express = require("express");
const app = express();
const logger = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const Sentry = require("@sentry/node");

const cron = require("./cron");

if (process.env.NODE_ENV === "production") {
    Sentry.init({
        dsn: process.env.SENTRY,
    });
    app.use(Sentry.Handlers.requestHandler());
}

app.get("/status", (req, res) => {
	res.status(200).send("OK");
});

logger.token("remote-addr", function (req) {
    return req.headers["x-real-ip"] || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
});
app.set("trust proxy", 1);
app.use(logger(":method :remote-addr :url :status :response-time"));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));

const port = process.env.PORT || 5000;

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_STRING, {
    useNewUrlParser: true,
    reconnectTries: 30,
    reconnectInterval: 2000,
});
mongoose.connection.on("error", (err) => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(1);
});

if (process.env.NODE_ENV === "development") {
	console.log('deberia tener cors')
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
            "Access-Control-Allow-Headers",
            "Authorization, X-API-KEY, Origin, X-Requested-Width, Content-Type, Accept, Access-Control-Request-Method"
        );
        res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
        next();
    });
} else {
    app.use(function (req, res, next) {
        const allowedOrigins = [
            "https://gestdoc.cl",
            "https://flow.gestdoc.cl",
            "http://gestdoc.cl",
            "http://flow.gestdoc.cl",
        ];
        const origin = req.headers.origin;
        if (allowedOrigins.includes(origin)) {
            res.setHeader("Access-Control-Allow-Origin", origin);
            res.header(
                "Access-Control-Allow-Headers",
                "Authorization, X-API-KEY, Origin, X-Requested-Width, Content-Type, Accept, Access-Control-Request-Method"
            );
            res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
            res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
        }
        next();
    });
}

require("./routes")(app);

if (process.env.NODE_ENV === "production") {
    app.use(Sentry.Handlers.errorHandler());
}

app.use(express.static(path.join(__dirname, "buildExpress")));
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "buildExpress", "index.html"));
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});

cron();
