// Update with your config settings.

module.exports = {
    development: {
        client: "sqlite3",
        connection: {
            filename: "./db/dev.sqlite",
        },
    },

    staging: {
        client: "sqlite3",
        connection: {
            filename: "./db/dev.sqlite",
        },
    },

    production: {
        client: "sqlite3",
        connection: {
            filename: "./db/dev.sqlite",
        },
    },
};

