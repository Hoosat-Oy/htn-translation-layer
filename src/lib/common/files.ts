import { DEBUG } from "../../core/errors"
import { AccountsDTO } from "../access/schemas/accountsSchema"
import filesSchema, { FilesDTO } from "./schemas/filesSchema"
import { GroupsDTO } from "../access/schemas/groupsSchema"


interface FileResultDTO {
  result: string,
  message: string
  file: FilesDTO
}

interface FilesResultDTO {
  result: string,
  message: string
  files: FilesDTO[]
}

/**
 * Creates an article file.
 *
 * @param author - The author of the article.
 * @param group - The group associated with the article.
 * @param data - The data of the article file.
 * @returns A Promise that resolves to a FileResultDTO.
 * @throws An error if the file cannot be saved.
 */
export const createFile = async (
  author: AccountsDTO,
  group: GroupsDTO,
  data: FilesDTO,
): Promise<FileResultDTO> => {
  const file = new filesSchema({
    group: group._id,
    author: author._id,
    filepath: data.filepath,
    newFilename: data.newFilename,
    originalFilename: data.originalFilename,
    domain: data.domain,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    publishedAt: 0,
  });
  const savedFile = await file.save();
  if(savedFile) {
    return { result: "success", message: "File has been saved.", file: savedFile };
  } else {
    throw new Error("Could not save file.");
  }
}

/**
 * Deletes a file.
 *
 * @param fileId - The ID of the file to delete.
 * @returns A Promise that resolves to a FileResultDTO.
 * @throws An error if the file cannot be deleted.
 */
export const deleteFile = async (fileId: string): Promise<FileResultDTO> => {
  const deletedFile = await filesSchema.findByIdAndDelete(fileId).exec();
  if (deletedFile) {
    return { result: "success", message: "File has been deleted.", file: deletedFile as FilesDTO };
  } else {
    throw new Error("Could not delete the file.");
  }
};

/**
 * Lists files by author.
 *
 * @param author - The author to retrieve files for.
 * @returns A Promise that resolves to a FilesResultDTO.
 * @throws An error if no files are found for the specified author.
 */
export const listFilesByAuthor = async (author: AccountsDTO): Promise<FilesResultDTO> => {
  const files = await filesSchema.find({ author: author._id }).exec();
  if (files) {
    return { result: "success", message: "Files retrieved successfully.", files: files };
  } else {
    throw new Error("No files found for the specified author.");
  }
};


/**
 * Lists files by domain.
 *
 * @param domain - The domain to retrieve files for.
 * @returns A Promise that resolves to a FilesResultDTO.
 * @throws An error if no files are found for the specified domain.
 */
export const listFilesByDomain = async (group: GroupsDTO, domain: string): Promise<FilesResultDTO> => {
  DEBUG.log(domain);
  const files = await filesSchema.find({ group: group._id, domain: domain }).exec();
  if (files) {
    return { result: "success", message: "Files retrieved successfully.", files: files };
  } else {
    throw new Error("No files found for the specified domain.");
  }
};

export const getFile = async (fid: string | undefined): Promise<FileResultDTO> => {
  const file = await filesSchema.findById(fid).exec();
  if (file) {
    return { result: "success", message: "Files retrieved successfully.", file: file };
  } else {
    throw new Error("No files found for the specified domain.");
  }
}

/**
 * Lists files by group.
 *
 * @param group - The group to retrieve files for.
 * @returns A Promise that resolves to a FilesResultDTO.
 * @throws An error if no files are found for the specified group.
 */
export const listFilesByGroup = async (group: GroupsDTO): Promise<FilesResultDTO> => {
  const files = await filesSchema.find({ group: group._id }).exec();
  if (files) {
    return { result: "success", message: "Files retrieved successfully.", files: files };
  } else {
    throw new Error("No files found for the specified group.");
  }
};