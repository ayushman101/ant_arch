import NATS from "../../../common/nats-core.js";
import Store from "../../../common/store.js";
const nats = {};

nats.send = (req, res, next) => {
    try {
        const { data } = req.body;
        const subject = Store.get ('nats.subjects')[0];

        NATS.send (subject, data);
        res.status (200).send ('msg sent success');
    }
    catch (err) {
        console.log (err);
        res.status (500).send ('failed to send');

    }
}

export default nats;
