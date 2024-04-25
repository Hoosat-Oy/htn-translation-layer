import { confirmGroupPermission, getGroup } from '../../lib/access/groups';
import { addMember, deleteMember, getMembersByGroup, updateMember } from '../../lib/access/members';
import { getAccount } from '../../lib/access/accounts';
import { confirmToken } from '../../lib/access/sessions';
import mongoose from 'mongoose';
import { createRouter } from '../../core/server';
import { DEBUG } from '../../core/errors';

/**
 * Members
 * /members/            POST    - Add member to group
 * /members/:id         PUT     - Update member in group
 * /members/group/:id   GET     - Get members in a group
 * /members/:id         DELETE  - Delete member from group
 */
const membersRouter = createRouter();

/**
 * @route GET /members
 * @description Endpoint for adding a member to a group.
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body.group - The group to add the member to.
 * @param {string} req.body.group._id - The ID of the group.
 * @param {string} req.body.rights - The rights to grant to the member.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} The HTTP response with status code and JSON object with result and message properties.
 * @throws {Object} The HTTP response with status code and error message.
 */
membersRouter.Get("/api/members/", async (req, res) => {
  try {
    const { account } = await confirmToken(req.headers.authorization);
    const { group } = await getGroup(req.body.group._id);
    const { permission } = await confirmGroupPermission("WRITE", group, account);
    if(permission !== true) {
      return res.status(500).json({ result: "error", message: "permission denied"});
    }
    return res.status(200).json(await addMember(account, group, req.body.rights)); 
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
 * @route PUT /members
 * @description Endpoint for updating the rights of a member in a group.
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body.group - The group containing the member.
 * @param {string} req.body.group._id - The ID of the group.
 * @param {string} req.body.rights - The updated rights of the member.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} The HTTP response with status code and JSON object with result and message properties.
 * @throws {Object} The HTTP response with status code and error message.
 */
membersRouter.Put("/api/members/", async (req, res) => {
  try {
    const { account } = await confirmToken(req.headers.authorization);
    const { group } = await getGroup(req.body.group._id);
    const { permission } = await confirmGroupPermission("WRITE", group, account);
    if(permission !== true) {
      return res.status(500).json({ result: "error", message: "permission denied"});
    }
    return res.status(200).json(await updateMember(account, group, req.body.rights));
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
 * @route DELETE /members
 * @description Endpoint for deleting a member from a group.
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body.group - The group containing the member.
 * @param {string} req.body.group._id - The ID of the group.
 * @param {string} req.body.account - The account to remove from the group.
 * @param {string} req.body.account._id - The ID of the account to remove from the group.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} The HTTP response with status code and JSON object with result and message properties.
 * @throws {Object} The HTTP response with status code and error message.
 */
membersRouter.Delete("/api/members/", async (req, res) => {
  try {
    const { account } = await confirmToken(req.headers.authorization);
    const { group } = await getGroup(req.body.group._id);
    const { permission } = await confirmGroupPermission("DELETE", group, account);
    if(permission !== true) {
      return res.status(500).json({ result: "error", message: "permission denied"});
    }
    const getAccountResult = await getAccount(req.body.account);
    return res.status(200).json(deleteMember(getAccountResult.account, group));
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
 * Get all members of a group
 * @function
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - Returns JSON object with members data
 * @throws {Error} - If an error occurs during the process
 */
membersRouter.Get("/api/members/group/:id", async (req, res) => {
  try {
    const { account } = await confirmToken(req.headers.authorization);
    const groupId = new mongoose.Types.ObjectId(req.params?.['id']);
    const { group } = await getGroup(groupId);
    const { permission } = await confirmGroupPermission("READ", group, account);
    if(permission !== true) {
      return res.status(500).json({ result: "error", message: "permission denied"});
    }
    return res.status(200).json(getMembersByGroup(group));
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
  membersRouter,
}

