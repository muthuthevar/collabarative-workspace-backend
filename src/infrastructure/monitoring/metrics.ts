import type { Request, Response, NextFunction } from "express";
import client from "prom-client";

const register = new client.Registry();

client.collectDefaultMetrics({ register });

export const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register],
});

export const httpRequestTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

export const activeConnections = new client.Gauge({
  name: "active_websocket_connections",
  help: "Number of active WebSocket connections",
  registers: [register],
});

export const jobsProcessed = new client.Counter({
  name: "jobs_processed_total",
  help: "Total number of jobs processed",
  labelNames: ["type", "status"],
  registers: [register],
});

export const cacheHits = new client.Counter({
  name: "cache_hits_total",
  help: "Total number of cache hits",
  labelNames: ["operation"],
  registers: [register],
});

export const cacheMisses = new client.Counter({
  name: "cache_misses_total",
  help: "Total number of cache misses",
  labelNames: ["operation"],
  registers: [register],
});

export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;

    httpRequestDuration
      .labels(req.method, route, res.statusCode.toString())
      .observe(duration);
    httpRequestTotal.labels(req.method, route, res.statusCode.toString()).inc();
  });

  next();
};

export const getMetrics = async (req: Request, res: Response) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
};

export { register };
