import { createRouter } from "../../core/server";
import { DEBUG } from "../../core/errors";
import { confirmToken } from "../../lib/access/sessions";
import { addIdentifier } from "../../lib/addresses/identifiers";
import { addAddress, getAddresses } from "../../lib/addresses/addresses";

/**
 * @route POST /addresses/identifier
 * @route POST /addresses/address
 * @route GET /addresses/identifier
 */

const addressesRouter = createRouter();

/**
 * @route POST /addresses/identifier
 * @group Addresses - Operations about addresses
 * @param {string} authorization.body.required - session token of the account
 * @param {string} identifier.body.required - Identifier to be added
 * @returns {object} 200 - Success response
 * @returns {string} 200.result - Indicates if the operation was successful
 * @returns {string} 200.message - Success message
 * @returns {object} 200.data - Data of the created identifier
 * @returns {string} 200.data.id - ID of the created identifier
 * @returns {string} 200.data.identifier - The created identifier
 * @returns {object} 400 - Bad request response
 * @returns {string} 400.result - Indicates if the operation was successful
 * @returns {string} 400.message - Error message
 * @returns {object} 404 - Bad request response
 * @returns {string} 404.result - Indicates if the operation was successful
 * @returns {string} 404.message - Error message
 * @returns {object} 500 - Bad request response
 * @returns {string} 500.result - Indicates if the operation was successful
 * @returns {string} 500.message - Error message
 */

addressesRouter.Post("/api/addresses/identifier", async (req, res) => {
  try {
    const confirmTokenResult = await confirmToken(req.headers.authorization);
    if (confirmTokenResult.result == "success") {
      const result = await addIdentifier(confirmTokenResult.account, req.body.identifier);
      if (result.result == "success") {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } else {
      return res.status(404).json(confirmTokenResult);
    }
  } catch (error) {
    DEBUG.log(error);
    if (typeof error === "object" && error !== null) {
      return res.status(500).json({ result: "error", message: error.toString() });
    } else {
      return res.status(500).json({ result: "error", message: "Unknown error" });
    }
  }
});

/**
 * @route POST /addresses/address
 * @group Addresses - Operations about addresses
 * @param {string} authorization.body.required - session token of the account
 * @param {string} identifier.body.required - Existing Identifier for the address
 * @param {string} address.body.required - Address to be added
 * @param {string} token.body.required - Token name of the address
 * @returns {object} 200 - Success response
 * @returns {string} 200.result - Indicates if the operation was successful
 * @returns {string} 200.message - Success message
 * @returns {object} 200.data - Data of the created address
 * @returns {string} 200.data.id - ID of the created address
 * @returns {string} 200.data.address - The created address
 * @returns {string} 200.data.identifier - The created addresses identifier
 * @returns {string} 200.data.token - The created addresses token
 * @returns {object} 400 - Bad request response
 * @returns {string} 400.result - Indicates if the operation was successful
 * @returns {string} 400.message - Error message
 * @returns {object} 404 - Bad request response
 * @returns {string} 404.result - Indicates if the operation was successful
 * @returns {string} 404.message - Error message
 * @returns {object} 500 - Bad request response
 * @returns {string} 500.result - Indicates if the operation was successful
 * @returns {string} 500.message - Error message
 */

addressesRouter.Post("/api/addresses/address", async (req, res) => {
  try {
    const { identifier, address, token } = req.body;
    const confirmTokenResult = await confirmToken(req.headers.authorization);
    if (confirmTokenResult.result == "success") {
      const result = await addAddress(identifier, address, token);
      if (result.result == "success") {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } else {
      return res.status(404).json(confirmTokenResult);
    }
  } catch (error) {
    DEBUG.log(error);
    if (typeof error === "object" && error !== null) {
      return res.status(500).json({ result: "error", message: error.toString() });
    } else {
      return res.status(500).json({ result: "error", message: "Unknown error" });
    }
  }
});

/**
 * @route GET /addresses/identifier
 * @group Addresses - Operations about addresses
 * @param {string} identifier.query.required - Identifier to retrieve
 * @returns {object} 200 - Success response
 * @returns {string} 200.result - Indicates if the operation was successful
 * @returns {array} 200.addresses - Data of the retrieved identifier
 * @returns {string} 200.addresses[index].id - ID of the retrieved identifier
 * @returns {string} 200.addresses[index].identifier - The retrieved identifier
 * @returns {string} 200.addresses[index].token - The retrieved identifier
 * @returns {string} 200.addresses[index].address - The retrieved identifier
 * @returns {object} 404 - Not found response
 * @returns {string} 404.result - Indicates if the operation was successful
 * @returns {string} 404.message - Error message
 */

addressesRouter.Get("/api/addresses/:identifier", async (req, res) => {
  try {
    if (req.params === undefined) {
      return res.status(404).json({ result: "error", message: "No parameters" });
    }
    const identifier = req.params["identifier"];
    const result = await getAddresses(identifier);
    if (result.result === "success") {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    DEBUG.log(error);
    if (typeof error === "object" && error !== null) {
      return res.status(500).json({ result: "error", message: error.toString() });
    } else {
      return res.status(500).json({ result: "error", message: "Unknown error" });
    }
  }
});

export { addressesRouter };
