import { authenticate, confirmToken } from "../../lib/access/sessions";
import { activateAccount, createAccount, sendActivationLink } from "../../lib/access/accounts";
import { createRouter } from "../../core/server";
import { DEBUG } from "../../core/errors";

/**
 * TODO: Write password recovery.
 * @route POST /authentication/register
 * @route POST /authentication/authenticate
 * @route POST /authentication/confirm
 * @route POST /authentication/activate/:code
 */

const authenticationRouter = createRouter();

/**
 * Authenticate user with email and password.
 * @route POST /authentication/authenticate
 * @group Authentication - User authentication APIs
 * @param {object} req - The HTTP request Object.
 * @param {object} res - The HTTP response Object.
 * @param {object} req.body.credentials - User credentials Object.
 * @returns {object} 200 - User Object.
 * @returns {object} 404 - Not found response
 * @returns {string} 404.result - Indicates if the operation was successful
 * @returns {string} 404.message - Error message
 */
authenticationRouter.Post("/api/authentication/authenticate", async (req, res) => {
  try {
    const authentication = await authenticate(req.body.credentials);
    return res.status(200).json(authentication);
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
 * Confirm user account with activation token.
 * @route POST /authentication/confirm
 * @group Authentication - User authentication APIs
 * @param {object} req - The HTTP request Object.
 * @param {object} res - The HTTP response Object.
 * @param {string} req.headers.authorization - User activation token.
 * @returns {object} 200 - Confirmation result Object.
 * @returns {object} 404 - Not found response
 * @returns {string} 404.result - Indicates if the operation was successful
 * @returns {string} 404.message - Error message
 */
authenticationRouter.Post("/api/authentication/confirm", async (req, res) => {
  if (req.headers.authorization === undefined) {
    return res.status(500).json({ result: "error", message: "No token given." });
  }
  try {
    const result = await confirmToken(req.headers.authorization);
    return res.status(200).json(result);
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
 * Register a new user account and send activation email.
 * @route POST /authentication/register
 * @group Authentication - User authentication APIs
 * @param {object} req - The HTTP request Object.
 * @param {object} res - The HTTP response Object.
 * @param {object} req.body.account - New user account Object.
 * @returns {object} 200 - Success Object with account details.
 * @returns {object} 404 - Not found response
 * @returns {string} 404.result - Indicates if the operation was successful
 * @returns {string} 404.message - Error message
 */
authenticationRouter.Post("/api/authentication/register", async (req, res) => {
  try {
    const accounResult = await createAccount(req.body.account);
    const { account } = accounResult;
    if (account.email === undefined) {
      throw new Error("Just created account email is undefined.");
    }
    return res.status(200).json({ result: "success", message: "Account created.", account: account });
  } catch (error) {
    DEBUG.log(error);
    DEBUG.log(error);
    if (typeof error === "object" && error !== null) {
      return res.status(500).json({ result: "error", message: error.toString() });
    } else {
      return res.status(500).json({ result: "error", message: "Unknown error" });
    }
  }
});
/**
 * Activate user account using provided activation code
 * @route Get /authentication/activate/:code
 * @group Authentication
 * @param {object} req - The HTTP request Object.
 * @param {object} res - The HTTP response Object.
 * @param {string} req.params.code - The activation code for the account to be activated
 * @returns {object} 200 - Success Object with account details.
 * @returns {object} 404 - Not found response
 * @returns {string} 404.result - Indicates if the operation was successful
 * @returns {string} 404.message - Error message
 */
authenticationRouter.Get("/api/authentication/activate/:code", async (req, res) => {
  try {
    if (req.params === undefined) {
      return res.status(404).json({ result: "error", message: "No parameters" });
    }
    const account = await activateAccount(req.params["code"]);
    if (account !== null && account !== undefined) {
      return res.status(200).json({ result: "success", message: "Account activated.", account: account });
    } else {
      return res.status(404).json({ result: "error", message: "Could not activate account with the code." });
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

export { authenticationRouter };
