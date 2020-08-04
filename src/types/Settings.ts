interface MongoSettings {
    user: string;
    password: string;
    host: string;
    port: number;
    name: string;
}

interface SentrySettings {
    dsn: string;
}

interface ApiSettings {
    version: string;
}

interface Settings {
    env: string;
    port: number;
    uaBlacklist: string[];
    database: MongoSettings;
    sentry: SentrySettings;
    api: ApiSettings;
}

export default Settings;
