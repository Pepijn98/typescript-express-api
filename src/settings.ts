import Settings from "~/types/Settings";
import pkg from "../package.json";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

const env = process.env.NODE_ENV || "development";

const settings: Settings = {
    env,
    port: env === "development" ? 3000 : 8080,
    uaBlacklist: [
        "Hakai/2.0",
        "Hello, World",
        "Googlebot",
        "Slurp",
        "Yahoo! Slurp",
        "bingbot",
        "AhrefsBot",
        "Baiduspider",
        "MJ12bot",
        "YandexBot"
    ],
    database: {
        user: process.env.MONGO_USER || "",
        password: process.env.MONGO_PASS || "",
        host: process.env.MONGO_HOST || "localhost",
        port: parseInt(process.env.MONGO_PORT || "27017"),
        name: process.env.MONGO_USER || "admin"
    },
    sentry: {
        dsn: process.env.DSN || ""
    },
    api: {
        version: pkg.version
    }
};

export default settings;
