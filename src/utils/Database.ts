import settings from "~/settings";
import { Model, ConnectionOptions, createConnection } from "mongoose";
import { StringBuilder } from "./StringBuilder";

import User from "~/schemas/app/User";
import UserModel from "~/types/app/User";

interface App {
    Users: Model<UserModel>;
}

class Database {
    App: App;

    constructor(options: ConnectionOptions) {
        const uri = StringBuilder.Format(
            "mongodb://{0}:{1}@{2}:{3}/{4}?retryWrites=true",
            settings.database.user,
            settings.database.password,
            settings.database.host,
            settings.database.port,
            settings.database.name
        );
        const connection = createConnection(uri, options);

        const db = connection.useDb("rest-template");
        this.App = {
            Users: db.model("Users", User)
        };
    }
}

export default Database;
