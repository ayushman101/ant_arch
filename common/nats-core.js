import { connect, StringCodec } from "nats";

export default class NATS {
    static #nc = null;

    static get nc () { return this.#nc; }

    static async init () {
        try {
            this.#nc = await connect ({});
            console.log (`nats connected ${this.nc.getServer ()}`)

            this.nc.closed ().then (() => {
                nc.drain ();
                console.log ('nats closed')
            });

            return this.#nc;
        }
        catch (err) {
            console.error (err);
            throw err;
        }
    }

    static subscribe (subject) {
        if (!subject)
            throw new Error ('subject undefined');

        if (!this.nc?.getServer?. ())
            throw new Error ('nats not initialized');

        const sub = this.nc.subscribe (subject);
        const codec = StringCodec ();
        (async () => {
            for await (const m of sub) {
                console.log(`${sub.getSubject ()} [${sub.getProcessed()}]: `, codec.decode(m.data));
            }
            console.log (`subscription closed [${sub.getSubject ()}]`)
        }) ();

        console.log ('nats subscribed to ', subject);
    }

    static send (subject, data) {
        if (!this.nc?.getServer?. ())
            throw new Error ('nats not initialized');

        if (!subject)
            throw new Error ('subject undefined');

        const codec = StringCodec ();
        const payload = codec.encode (JSON.stringify (data));

        this.#nc.publish (subject, payload);
    }
}

