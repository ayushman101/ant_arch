import { Router } from "express";
import nats from "../controllers/nats.js";

const router = Router ();

router.get ('/', nats.send);

export default router;
