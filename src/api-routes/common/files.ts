import { unlink } from 'fs';
import { DEBUG, ErrorHandler } from '../../core/errors';
import { createRouter } from '../../core/server';
import { confirmGroupPermission, confirmPermission, getGroup } from '../../lib/access/groups';
import { confirmToken } from '../../lib/access/sessions';
import { createFile, deleteFile, listFilesByGroup, listFilesByAuthor, listFilesByDomain, getFile } from '../../lib/common/files';
import { FilesDTO } from '../../lib/common/schemas/filesSchema';
import mongoose from 'mongoose';

const filesRouter = createRouter();

filesRouter.Post('/api/files', async (req, res) => {
  try {
    const { account } = await confirmToken(req.headers.authorization);
    const { group } = await confirmPermission(account, 'WRITE');
    const domain = req.headers.host?.split(":")[0];
    for (const key in req.files) {
      const files = req.files[key];
      if (Array.isArray(files)) {
        for (const file of files) {
          const dbFile: FilesDTO = {
            group: group._id,
            author: account._id,
            domain: domain,
            filepath: file.filepath,
            newFilename: file.newFilename,
            originalFilename: file.originalFilename,
          };
          await createFile(account, group, dbFile);
        }
      }
    }
    return res.status(200).json({ result: 'success', files: req.files });
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});

filesRouter.Get('/api/files/group/:groupId', async (req, res) => {
  try {
    const { account } = await confirmToken(req.headers.authorization);
    if (req.params === undefined) {
      return res.status(404).json({ result: 'error', message: "No parameters" });
    }
    const groupId = new mongoose.Types.ObjectId(req.params['groupId']);
    const { group } = await getGroup(groupId);
    const { result } = await confirmGroupPermission('READ', group, account);
    if (result !== "success") {
      return res.status(500).json({ result: 'error', message: "No permission" });
    }
    const files = await listFilesByGroup(group);
    return res.status(200).json(files);
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});

filesRouter.Get('/api/files/domain/:domain', async (req, res) => {
  try {
    const { account } = await confirmToken(req.headers.authorization);
    const { result, group } = await confirmPermission(account, 'READ');
    if (result !== "success") {
      return res.status(500).json({ result: 'error', message: "No permission" });
    }
    if (req.params === undefined) {
      return res.status(404).json({ result: 'error', message: "No parameters" });
    }
    const files = await listFilesByDomain(group, req.params['domain']);
    return res.status(200).json(files);
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});

filesRouter.Get('/api/files/author/', async (req, res) => {
  try {
    const { account } = await confirmToken(req.headers.authorization);
    const files = await listFilesByAuthor(account);
    return res.status(200).json(files);
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});

filesRouter.Delete('/api/files/:fileId', async (req, res) => {
  try {
    const { account } = await confirmToken(req.headers.authorization);
    const { file } = await getFile(req.params?.['fileId']);
    const { result } = await confirmGroupPermission('READ', file.group!, account);
    if (result !== "success") {
      return res.status(500).json({ result: 'error', message: "No permission" });
    }
    if (req.params === undefined) {
      return res.status(404).json({ result: 'error', message: "No parameters" });
    }
    const deleted = await deleteFile(req.params['fileId']);
    unlink(deleted.file.filepath!, (err) => {
      DEBUG.log(`${deleted.file.filepath} was not deleted\r\n ${err}`);
    });
    unlink(deleted.file.filepath! + ".br", (err) => {
      DEBUG.log(`${deleted.file.filepath} was not deleted\r\n ${err}`);
    });
    unlink(deleted.file.filepath! + ".deflate", (err) => {
      DEBUG.log(`${deleted.file.filepath} was not deleted\r\n ${err}`);
    });
    unlink(deleted.file.filepath! + ".gzip", (err) => {
      DEBUG.log(`${deleted.file.filepath} was not deleted\r\n ${err}`);
    });
    return res.status(200).json({ result: 'success', message: 'File deleted successfully.' });
  } catch (error) {
    return res.status(500).json(ErrorHandler(error));
  }
});

export { 
  filesRouter 
};
