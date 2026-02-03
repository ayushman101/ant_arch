import express from 'express';
import cors from 'cors';
import nats from './routes/nats.js';

export default class App {
    static addMiddlewares ({ app }) {
        app.use (cors ({
            origin : true,
            credentials  : true,
            exposedHeaders : ['x-request-Id'],
        }));
        app.use (express.json ());
        app.use (express.urlencoded ({ extended : false }));
        app.use ('/nats-ping', nats);
    }
}
