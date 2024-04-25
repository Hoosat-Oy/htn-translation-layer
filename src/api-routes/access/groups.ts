
import { DEBUG } from '../../core/errors';
import { createRouter } from '../../core/server';
import { 
  confirmGroupPermission,
  createGroup, 
  deleteGroup, 
  getGroup, 
  getGroups, 
  updateGroup
} from '../../lib/access/groups';
import { getMembersByGroup } from '../../lib/access/members';
import { confirmToken } from '../../lib/access/sessions';
import mongoose from 'mongoose';

/**
 * Groups
 * /group/              POST    - Create group
 * /group/              PUT     - Update group
 * /groups/             GET     - Get groups
 * /group/:id           GET     - Get group by id
 * /group/:id           DELETE  - Delete group by id
 * /group/:id/members   GET   - Get members of the group.
 */

const groupsRouter = createRouter();

/**
 * POST endpoint for creating a new group.
 * @function
 * @async
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} The response object with the status and result.
 * @throws {object} The response object with an error message if the request fails.
 */
groupsRouter.Post("/api/group/", async (req, res) => {
  try {
    const { account } = await confirmToken(req.headers.authorization);
    return res.status(201).json(await createGroup(req.body.group, account));
  } catch  (error) {
    DEBUG.log(error);
    if (typeof error === "object" && error !== null) {
      return res.status(500).json({ result: "error", message: error.toString() });
    } else {
      return res.status(500).json({ result: "error", message: "Unknown error" });
    }
  }
});

/**
 * Updates a group if the member has WRITE permission.
 * @function
 * @async
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.headers.authorization - The authorization header.
 * @param {Object} req.body.group - The group to update.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The HTTP response.
 * @throws Will throw an error if authorization fails, if the member does not have WRITE permission, or if the update fails.
 *
 * @example
 * // Returns an array of all groups
 * PUT /group/
 */
groupsRouter.Put("/api/group/", async (req, res) => {
  try {
    const { account } = await confirmToken(req.headers.authorization);
    await confirmGroupPermission("WRITE", req.body.group, account);
    return res.status(200).json(await updateGroup(req.body.group, account));
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
 * Retrieves all groups.
 *
 * @async
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Promise object that represents the completion of the request.
 * @throws {Error} - Throws an error if there is a server error.
 *
 * @example
 * // Returns an array of all groups
 * GET /groups/
 */
groupsRouter.Get("/api/groups/", async (req, res) => {
  try {
    const { account } = await confirmToken(req.headers.authorization);
    if(!account) {
      return res.status(500).json({ result: "error", message: "Permission denied."})
    }
    return res.status(200).json(await getGroups());
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
 * Express route handler for getting a group by ID.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Parameters extracted from the URL path.
 * @param {string} req.params.id - ID of the group to get.
 * @param {Object} req.headers.authorization - Authorization token in the request headers.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} A promise that resolves to an object representing the HTTP response.
 * @throws Will throw an error if there is an unexpected server-side issue.
 */
groupsRouter.Get("/api/group/:id", async (req, res) => {
  try {
    const { account } = await confirmToken(req.headers.authorization);
    if(!account) {
      return res.status(500).json({ result: "error", message: "Permission denied."})
    }
    const groupId = new mongoose.Types.ObjectId(req.params?.['id']);
    return res.status(200).json(await getGroup(groupId));
  } catch (error) {
    DEBUG.log(error);
    return res.status(500).json({ result: "error", message: error });
  }
});

/**
 * Handles HTTP DELETE requests for deleting a group with the specified ID.
 * @function
 * @async
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} The HTTP response with status code and JSON object with result, message and groups properties.
 * @throws {Object} The HTTP response with status code and error message.
 */
groupsRouter.Delete("/api/group/:id", async (req, res) => {
  try {
    const { account } = await confirmToken(req.headers.authorization);
    const groupId = new mongoose.Types.ObjectId(req.params?.['id']);
    const {group} = await getGroup(groupId);
    if(group === null) {
      throw new Error("Could not find group with the ID.");
    }    
    return res.status(201).json(await deleteGroup(group, account));
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
 * Handles HTTP GET requests for getting list of group members.
 * @function
 * @async
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} The HTTP response with status code and JSON object with result, message and group and members properties.
 * @throws {Object} The HTTP response with status code and error message.
 */
groupsRouter.Get("/api/group/:id/members", async (req, res) => {
  try {
    const { account } = await confirmToken(req.headers.authorization);
    const groupId = new mongoose.Types.ObjectId(req.params?.['id']);
    const { group } = await getGroup(groupId);
    if(group === null) {
      throw new Error("Could not find group with the ID.");
    }
    let {permission} = await confirmGroupPermission("READ", group, account);
    if(permission === false) {
      throw new Error("Could not confirm permission");
    }
    return res.status(200).json(await getMembersByGroup(group));
  } catch (error) {
    DEBUG.log(error);
    if (typeof error === "object" && error !== null) {
      return res.status(500).json({ result: "error", message: error.toString() });
    } else {
      return res.status(500).json({ result: "error", message: "Unknown error" });
    }
  }
});

export {
  groupsRouter,
}

