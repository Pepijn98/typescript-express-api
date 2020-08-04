import path from "path";
import express from "express";
import morgan from "morgan";
import chalk from "chalk";
import cors from "cors";
import robots from "express-robots-txt";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import uaBlocker from "express-user-agent-blocker";
import compression from "compression";
import helmet from "helmet";
import settings from "~/settings";
import Logger from "~/utils/Logger";
import Router from "~/router/Router";
import { Response } from "./types/Response";
import { statusCodes, ExtendedRequest } from "./utils/utils";

const server = express();
const logger = new Logger();
const api = new Router(logger);

function rawBodySaver(req: ExtendedRequest, _res: express.Response, buf: Buffer, encoding: BufferEncoding): void {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || "utf8");
    }
}

/** Colored route type */
morgan.token<express.Request, express.Response>("type-colored", (req) => {
    if (req.originalUrl && req.originalUrl.includes("/api")) {
        return chalk.bold.green("[ API ]");
    } else {
        return chalk.bold.blue("[ WEB ]");
    }
});

/** Colored status code */
morgan.token<express.Request, express.Response>("status-colored", (_req, res) => {
    if (res.headersSent || Boolean(Object.entries(res.getHeaders()).length)) {
        let status = "";
        const statusCode = res.statusCode.toString();
        switch (true) {
            case res.statusCode >= 500:
                status = chalk.red(statusCode);
                break;
            case res.statusCode >= 400:
                status = chalk.yellow(statusCode);
                break;
            case res.statusCode >= 300:
                status = chalk.cyan(statusCode);
                break;
            case res.statusCode >= 200:
                status = chalk.green(statusCode);
                break;
            default:
                status = chalk.gray(statusCode);
                break;
        }
        return status;
    }
    return "";
});

async function main(): Promise<void> {
    await api.init();

    server.set("json spaces", 4);
    server.set("env", settings.env);

    server.use(
        morgan(':type-colored :req[cf-connecting-ip] :method :url :status-colored :response-time[0]ms ":user-agent"', {
            skip: (req) => !req.originalUrl.includes("/api") || req.originalUrl.includes("robots.txt")
        })
    );
    server.use(cors({ origin: "*" }));
    server.use(uaBlocker(settings.uaBlacklist, { text: "Nothing to see here - move along please..." }));
    server.use(compression());
    server.use(helmet());
    server.use(cookieParser());
    server.use(bodyParser.json({ verify: rawBodySaver }));
    server.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true }));
    server.use(bodyParser.raw({ verify: rawBodySaver, type: () => true }));
    server.use(express.static(path.join(__dirname, "static")));
    server.use(robots({ UserAgent: settings.uaBlacklist, Disallow: ["*"], CrawlDelay: "10" }));
    server.use(api.path, api.router);

    server.get("/", (_, res) => res.redirect(301, "/api"));

    // Catch all other routes that aren't registered
    server.get("*", (req, res) => {
        if (req.originalUrl.includes("/api")) {
            res.status(404).json(Response(statusCodes[404].json));
        } else {
            res.status(404).sendFile(statusCodes[404].file ?? "");
        }
    });

    // Start listening on a defined port
    server.listen(settings.port, () => {
        logger.ready(`Starting http server on http://localhost:${settings.port}`);
    });
}

main().catch((e) => logger.error("MAIN", e));
