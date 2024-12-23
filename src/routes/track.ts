import express from "express";
import { TrackingController } from "../controllers/track.controller";

const trackRoutes = express.Router();

// Render tracking page
trackRoutes.get("/tracker", TrackingController.getTrackPage);

// Start tracking with automatic screenshots
trackRoutes.post("/start", TrackingController.startTracking);

// Stop tracking and clear automatic screenshot interval
trackRoutes.post("/stop", TrackingController.stopTracking);

export default trackRoutes;
