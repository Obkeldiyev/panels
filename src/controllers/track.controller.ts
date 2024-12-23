import { ErrorHandler } from "@errors";
import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import screenshot from "screenshot-desktop";
import path from "path";
import fs from "fs";

const client = new PrismaClient();
let screenshotInterval: NodeJS.Timeout | null = null;

export class TrackingController {
  static async getTrackPage(req: Request, res: Response, next: NextFunction) {
    try {
      res.render("tracks/getTrack"); // Renders the tracking EJS page
    } catch (error: any) {
      next(new ErrorHandler(error.message, error.status || 500));
    }
  }

  static async startTracking(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.cookies;
      const data: any = verify(token, process.env.SECRET_KEY as string);

      const employee = await client.employee.findUnique({
        where: { id: data.id },
      });

      if (!employee) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const tracking = await client.tracking.create({
        data: {
          employeeId: employee.id,
          startedAt: new Date(),
          workDuration: 0, // Initialize with 0
          mouseMovements: 0, // Initialize with 0
        },
      });

      const trackingId = tracking.id;

      screenshotInterval = setInterval(async () => {
        try {
          const relativeScreenshotPath = `/screenshots/${trackingId}_${Date.now()}.jpg`;

          const absoluteScreenshotPath = path.join(
            __dirname,
            "../public",
            relativeScreenshotPath
          );

          const img = await screenshot({ format: "jpg" });
          fs.writeFileSync(absoluteScreenshotPath, img);

          const something = await client.photo.create({
            data: {
              employeeId: employee.id,
              trackingId,
              url: relativeScreenshotPath, // Save relative path
            },
          });          
        } catch (screenshotError) {
          console.error("Screenshot capture error:", screenshotError);
        }
      }, 10 * 60 * 10); // 10 minutes

      res.json({ message: "Tracking started", trackingId });
    } catch (error: any) {
      next(new ErrorHandler(error.message, error.status || 500));
    }
  }

  static async updateTracking(req: Request, res: Response, next: NextFunction) {
    try {
      const { trackingId, workDuration, mouseMovements, typedKeys } = req.body;

      // Update the tracking record with new work duration and mouse movements
      const tracking = await client.tracking.update({
        where: { id: trackingId },
        data: {
          workDuration: { increment: workDuration },
          mouseMovements: { increment: mouseMovements },
          // Optionally, you can add a `typedKeys` or similar field to the DB
          // typedKeys: { increment: typedKeys },
        },
      });

      res.json({ message: "Tracking updated", tracking });
    } catch (error: any) {
      next(new ErrorHandler(error.message, error.status || 500));
    }
  }

  static async stopTracking(req: Request, res: Response, next: NextFunction) {
    try {
      const { trackingId } = req.body;

      if (screenshotInterval) {
        clearInterval(screenshotInterval);
        screenshotInterval = null;
      }

      await client.tracking.update({
        where: { id: trackingId },
        data: { stopTime: new Date() },
      });

      res.json({ message: "Tracking stopped" });
    } catch (error: any) {
      next(new ErrorHandler(error.message, error.status || 500));
    }
  }
}
