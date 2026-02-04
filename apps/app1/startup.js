import Startup from "../../common/startup-app.js";
import App from "./app.js";
import NATS from "../../common/nats-core.js";

const name = 'firstApp';
const type = 'app';
const pretty_name = 'app One';


(async () => {
    try {
        const { port, natsSubjects } = await Startup.init ({ name, type, pretty_name });
        for (const sub of natsSubjects) {
            NATS.subscribe (sub);
        }
        await Startup.startServer ({ appHandle : App, port, name });
    }
    catch (err) {
        console.error (err);
    }
}) ();
