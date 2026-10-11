import { NextResponse, NextRequest } from "next/server";
import * as Sentry from "@sentry/nextjs";
import AppError from "./error";
import { logger } from "./logger";
type Handler<C> = (req: NextRequest, ctx: C) => Promise<Response>;

export const handle = <C = unknown>(fn: Handler<C>) => {
  return async (req: NextRequest, ctx: C) => {
    const start = performance.now(); // Open a start duration
    const requestId = crypto.randomUUID(); // Generate a random request ID to track process
    const method = req.method; // Detect type of the API method
    const path = req.nextUrl.pathname; // Path of the API request
    try {
      const response = await fn(req, ctx);
      const durationMs = Math.round(performance.now() - start); // Calculate beginning and end of the function's duration

      // LOG API DETAILS
      logger.info(
        {
          requestId,
          method,
          path,
          status: response.status,
          durationMs,
        },
        "Request completed",
      );
      return response;
    } catch (err) {
     const durationMs = Math.round(performance.now() - start);
      if (err instanceof AppError) {
           logger.warn(
          {
            requestId,
            method,
            path,
            status: err.status,
            durationMs,
            message: err.message,
            cause: err.cause,
          },
          "Client error"
        );
        return NextResponse.json(
          { error: err.message },
          { status: err.status },
        );
      }

      logger.error({
        requestId,
        method,
        status:500,
        durationMs,
        err
      },
      "Unhandled Server Error"
    )
    
    Sentry.captureException(err,{
        extra:{requestId,method,path}
    })
  
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  };
};
