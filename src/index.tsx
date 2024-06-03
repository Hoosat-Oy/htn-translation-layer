import React from "react";
import dotenv from "dotenv";
import { I18nextProvider } from "react-i18next";
import i18n from "./core/i18n";
import { cors } from "./core/cors";
import { createRouter, createServer, listen } from "./core/server";
import { assets } from "./core/assets";
import { upload } from "./core/upload";
import { pingRouter } from "./api-routes/ping";
import { renderer } from "./core/renderer";
import { DEBUG } from "./core/errors";
import { APIRouter } from "./api-routes";
import { writeNonceToFile } from "./core/nonce";

dotenv.config();

const isDevelopment = process.argv[2] === "development";
let publicDir = "./build/public";
if (isDevelopment) {
  publicDir = "./build-dev/public";
}

writeNonceToFile();

// Create a router
const router = createRouter();

router.UseRouter(pingRouter);

/**
 * Middleware to handle CORS for allowed origins and HTTP methods.
 * @function
 * @param {string} origins - The allowed origins, separated by commas.
 * @param {string} methods - The allowed HTTP methods, separated by commas.
 */
router.Middleware(cors(process.env.ORIGINS || "localhost:8000", "GET, POST, PUT, DELETE"));

/**
 * Middleware to serve static files from the "public" directory.
 * @function
 * @param {string} publicDir - The path to the "public" directory.
 */
router.Middleware(assets(publicDir));

/**
 * Middleware to handle multipart/form-data file uploading.
 * @function
 * @param {string} publicDir - The path to the "public" directory for uploads.
 */
// router.Middleware(upload(`${publicDir}/uploads`));

/**
 * POST route to handle file uploads.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
// router.Post('/api/upload', (req, res) => {
//   // Access the uploaded files through req.files
//   console.log(req.files);
//   // Since the file upload was handled globally by middleware send a response.
//   res.status(200).json({ result: "success", files: req.files });
// });

router.UseRouter(APIRouter);
DEBUG.log("APIRouter added.");

/**
 * GET route to handle all other requests.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.Get("*", async (_req, res) => {
  res.send("Nothing here!");
});

// Create the server
const server = createServer(router);

// Start listening on port 8080
const port = parseInt(process.env.PORT || "8080");
listen(server, port, () => {
  console.log(`Server is running on port ${port}`);
});
