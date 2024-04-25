import { createRouter } from "../core/server";

/**
 * The Ping API router instance used for defining routes and handling requests.
 * @type {PingRouter}
 */
const pingRouter = createRouter();

/**
 * Handles GET requests to the "/api/ping/:id" endpoint.
 *
 * @param {HoosatRequest} req - The incoming request object.
 * @param {HoosatResponse} res - The server response object.
 * @returns {void}
 */
pingRouter.Get("/api/ping/:id", (req, res) => {
  res.status(200).send(`pong! ${req.params!['id']}`);
});

/**
 * Handles GET requests to the "/api/ping/" endpoint.
 *
 * @param {HoosatRequest} req - The incoming request object.
 * @param {HoosatResponse} res - The server response object.
 * @returns {void}
 */
pingRouter.Get("/api/ping/", (_req, res) => {
  res.status(200).send(`pong!`);
});

export { pingRouter }
