"use strict";

import { DEBUG } from "../../core/errors";
import { AccountsDTO } from "../access/schemas/accountsSchema";
import { GroupsDTO } from "../access/schemas/groupsSchema";
import pagesSchema, { PagesDTO } from "./schemas/pagesSchema";

/**
 * @author: Toni Lukkaroinen
 * @license: MIT
 */


export interface PagesResultDTO {
  result: string,
  message: string,
  pages: PagesDTO[]
}

export interface PageResultDTO {
  result: string,
  message: string,
  page: PagesDTO
}

/**
 * Adds a page to the specified group with the given rights.
 * @function
 * @async
 * @param {AccountsDTO} author - The account that is creating the page.
 * @param {GroupsDTO} group - The group that owns the page.
 * @param {PagesDTO} data - The page data.
 * @returns {Promise<PageResultDTO>} - A promise that resolves to PageResultDTO
 */
export const createPage = async (author: AccountsDTO, group: GroupsDTO, data: PagesDTO): Promise<PageResultDTO> => {
  const pagesCount = await pagesSchema.find({ domain: data.domain }).countDocuments({}).exec();
  const page = new pagesSchema({
    group: group._id,
    author: author._id,
    name: data.name,
    order: pagesCount + 1,
    link: data.link,
    markdown: data.markdown,
    icon: data.icon,
    domain: data.domain,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  const savedPage = await page.save();
  if (savedPage) {
    return { result: "success", message: "Page has been saved.", page: savedPage };
  } else {
    throw new Error("Could not save page.");
  }
};

/**
 * Updates page.
 * @function
 * @async
 * @param {PagesDTO} data - The data that is to be updated.
 * @returns {Promise<PageResultDTO>} - A promise that resolves to PageResultDTO
 */
export const updatePage = async (data: PagesDTO): Promise<PageResultDTO> => {
  const updatedPage = await pagesSchema
    .findOneAndUpdate(
      { _id: data._id },
      {
        name: data.name,
        link: data.link,
        order: data.order,
        markdown: data.markdown,
        icon: data.icon,
        domain: data.domain,
        updatedAt: Date.now(),
      }
    )
    .exec();

  if (updatedPage) {
    return { result: "success", message: "Page has been updated.", page: updatedPage };
  } else {
    throw new Error("Could not update page.");
  }
};

/**
 * Delete page.
 * @function
 * @async
 * @param {string} id - The identifier of the page to be deleted.
 * @returns {Promise<PageResultDTO>} - A promise that resolves to PageResultDTO
 */
export const deletePage = async (id: string): Promise<PageResultDTO> => {
  const deletedPage = await pagesSchema.findOneAndDelete({ _id: id }).exec();
  if (deletedPage) {
    return { result: "success", message: "Page has been deleted.", page: deletedPage as PagesDTO };
  } else {
    throw new Error("Could not delete page.");
  }
};

/**
 * Delete page.
 * @function
 * @async
 * @param {string} id - The identifier of the page to be deleted.
 * @returns {Promise<PageResultDTO>} - A promise that resolves to PageResultDTO
 */
export const getPage = async (id: string): Promise<PageResultDTO> => {
  DEBUG.log("id: ", id);
  const page = await pagesSchema.findOne({ _id: id }).exec();
  if (page) {
    return { result: "success", message: "Page has been found.", page: page };
  } else {
    throw new Error("Could not find page.");
  }
};

/**
 * Get page by link. 
 * @function
 * @async
 * @param {string} link - The identifier of the page to be get.
 * @returns {Promise<PageResultDTO>} - A promise that resolves to PageResultDTO
 */
export const getPageByLink = async (link: string): Promise<PageResultDTO> => {
  DEBUG.log("link: " + link);
  const page = await pagesSchema.findOne({ link: `/${link}` }).exec();
  if (page) {
    return { result: "success", message: "Page has been found.", page: page };
  } else {
    throw new Error("Could not find page.");
  }
};

/**
 * Get pages by domain
 * @function
 * @async
 * @param {string} domain - The identifier of the page to be get.
 * @returns {Promise<PagesResultDTO>} - A promise that resolves to null or the article.
 */
export const getPagesByDomain = async (domain: string): Promise<PagesResultDTO> => {
  if (domain === undefined) {
    throw new Error("Domain is empty.");
  }
  const pages = await pagesSchema.find({ domain: domain }).sort({ order: 1 }).exec();
  if (pages) {
    return { result: "success", message: "Pages found.", pages: pages };
  } else {
    throw new Error("Could not get page.");
  }
};

/**
 * Get pages by group
 * @function
 * @async
 * @param {string} group - The identifier of the page to be get.
 * @returns {Promise<PagesResultDTO>} - A promise that resolves to null or the article.
 */
export const getPagesByGroup = async (group: string): Promise<PagesResultDTO> => {
  if (group === undefined) {
    throw new Error("Group is empty.");
  }
  const pages = await pagesSchema.find({ group: group }).sort({ order: 1 }).exec();
  if (pages) {
    return { result: "success", message: "Pages found.", pages: pages };
  } else {
    throw new Error("Could not get page.");
  }
};

/**
 * Get pages by author
 * @function
 * @async
 * @param {string} author - The identifier of the page to be get.
 * @returns {Promise<PagesResultDTO>} - A promise that resolves to null or the article.
 */
export const getPagesByAuthor = async (author: string): Promise<PagesResultDTO> => {
  if (author === undefined) {
    throw new Error("Author is empty.");
  }
  const pages = await pagesSchema.find({ author: author }).sort({ order: 1 }).exec();
  if (pages) {
    return { result: "success", message: "Pages found.", pages: pages };
  } else {
    throw new Error("Could not get page.");
  }
};
