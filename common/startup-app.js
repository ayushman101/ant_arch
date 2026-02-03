import store from "./store.js";
import express from 'express';
import http from 'node:http';
import NATS from "./nats-core.js";

export default class Startup {
    static async init (args) {
        const { type, name, desc, pretty_name } = args;
        if (!type)
            throw new Error ('type is undefined');

        if (!name)
            throw new Error ('name is undefined');

        if (!pretty_name)
            throw new Error ('pretty_name is undefined');

        store.readAndStore ({ type, name });
        store.set (`desc`, desc);
        store.set (`pretty_name`, pretty_name);

        const port = store.get (`port`);
        const natsSubjects = store.get (`nats.subjects`);

        await NATS.init ();

        return { port, natsSubjects };
    }

    static createServer () {
        const app = express ();
		app.disable ('x-powered-by');
		app.set ('trust proxy', true);
        return app;
    }

    static async startServer ({ appHandle, port, name }) {
        const app = this.createServer ();
        const server = http.createServer (app);

        if (appHandle.addMiddlewares) {
            appHandle.addMiddlewares ({ app });
        }

        server.on ('listening', async () => {
            const address = server.address ();
            const port = address.port;

            console.log (`${name} server started on port : ${port}`)
        });

        server.listen (port);
        return;
    }
}
