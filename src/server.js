require('dotenv').config();
const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
    const server = Hapi.server({
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || 5000,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    server.route(routes);
    await server.start();

    console.log(`
    -
    -
    -
    - To the infinity, and beyond ------> ${server.info.uri}
    -
    -
    -
    `);
};

init();
