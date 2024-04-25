import { AccountsDTO } from "../access/schemas/accountsSchema";
import articlesSchema, { ArticlesDTO } from "./schemas/articlesSchema";
import { GroupsDTO } from "../access/schemas/groupsSchema";


interface ArticleResultDTO {
  result: string,
  message: string
  article: ArticlesDTO
}

interface ArticlesResultDTO {
  result: string,
  message: string
  articles: ArticlesDTO[]
}

/**
 * Creates a new article for a group.
 * @function
 * @async
 * @param {AccountsDTO} author - The account that is creating the article.
 * @param {GroupsDTO} group - The group that owns the article.
 * @param {ArticlesDTO} data - The article that is saved.
 * @returns {Promise<ArticlesResultDTO>} - A promise that resolves to null or the saved article indicating wheter saving the article worked or not.
 */
export const createArticle = async (
  author: AccountsDTO,
  group: GroupsDTO,
  data: ArticlesDTO,
): Promise<ArticleResultDTO> => {
  const article = new articlesSchema({
    group: group._id,
    author: author._id,
    header: data.header,
    markdown: data.markdown,
    read: data.read,
    domain: data.domain,
    publish: data.publish,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    publishedAt: 0,
  });
  const savedArticle = await article.save();
  if(savedArticle) {
    return { result: "success", message: "Article has been saved.", article: savedArticle };
  } else {
    throw new Error("Could not save article.")
  }
}

/**
 * Updates article.
 * @function
 * @async
 * @param {ArticlesDTO} data - The data that is to be updated.
 * @returns {Promise<ArticleResultDTO>} - A promise that resolves to null or the updated article indicating wheter updating the article worked or not.
 */
export const updateArticle = async (
  data: ArticlesDTO,
): Promise<ArticleResultDTO> => {
  const updatedArticle = await articlesSchema.findOneAndUpdate({ _id: data._id }, {
    header: data.header,
    markdown: data.markdown,
    read: data.read,
    domain: data.domain,
    publish: data.publish,
    updatedAt: Date.now(),
  }, { new: true }).exec();
  if(updatedArticle) {
    return { result: "success", message: "Article has been updated.", article: updatedArticle };
  } else {
    throw new Error("Could not update article.")
  }
}

export const publishArticle = async (
  data: ArticlesDTO,
): Promise<ArticleResultDTO> => {
  const updatedArticle = await articlesSchema.findOneAndUpdate({ _id: data._id }, {
    header: data.header,
    markdown: data.markdown,
    read: data.read,
    domain: data.domain,
    publish: true,
    updatedAt: Date.now(),
    publishedAt: Date.now()
  }, { new: true }).exec();
  if(updatedArticle) {
    return { result: "success", message: "Article has been published.", article: updatedArticle };
  } else {
    throw new Error("Could not publish article.")
  }
}

export const unpublishArticle = async (
  data: ArticlesDTO,
): Promise<ArticleResultDTO> => {
  const updatedArticle = await articlesSchema.findOneAndUpdate({ _id: data._id }, {
    header: data.header,
    markdown: data.markdown,
    read: data.read,
    domain: data.domain,
    publish: false,
    updatedAt: Date.now(),
    publishedAt: 0
  }, { new: true }).exec();
  if(updatedArticle) {
    return { result: "success", message: "Article has been unpublished.", article: updatedArticle };
  } else {
    throw new Error("Could not unpublish article.")
  }
}

/**
 * Delete article.
 * @function
 * @async
 * @param {string} id - The identifier of the article to be deleted.
 * @returns {Promise<ArticleResultDTO>} - A promise that resolves to null or the deleted article indicating wheter deleting the article worked or not.
 */
export const deleteArticle = async (
  id: string,
): Promise<ArticleResultDTO> => {
  const deletedArticle = await articlesSchema.findOneAndDelete({ _id: id}).exec();
  if(deletedArticle) {
    return { result: "success", message: "Article has been deleted.", article: deletedArticle as ArticlesDTO };
  } else {
    throw new Error("Could not delete article.")
  }
}

/**
 * Get public articles.
 * @function
 * @async
 * @returns {Promise<ArticlesResultDTO>} - A promise that resolves to null or the article.
 */
export const getPublicArticles = async (
): Promise<ArticlesResultDTO> => {
  const articles = await articlesSchema.find({ publish: true }).sort({ publishedAt: "desc" }).exec();
  if(articles) {
    return { result: "success", message: "Articles found.", articles: articles };
  } else {
    throw new Error("Could not find articles.")
  }
}


/**
 * Get public articles by domain.
 * @function
 * @async
 * @param {string} domain - The identifier of the article to be searched.
 * @returns {Promise<ArticlesResultDTO>} - A promise that resolves to null or the article.
 */
export const getPublicArticlesByDomain = async (
  domain: string,
): Promise<ArticlesResultDTO> => {
  const articles = await articlesSchema.find({ publish: true, domain: domain }).sort({ publishedAt: "desc" }).exec();
  if(articles) {
    return { result: "success", message: "Articles found.", articles: articles };
  } else {
    throw new Error("Could not find articles.")
  }
}

/**
 * Get public articles by group.
 * @function
 * @async
 * @param {GroupsDTO} group - The identifier of the article to be searched.
 * @returns {Promise<ArticlesResultDTO>} - A promise that resolves to null or the article.
 */
export const getPublicArticlesByGroup = async (
  group: GroupsDTO,
): Promise<ArticlesResultDTO> => {
  const articles = await articlesSchema.find({ publish: true, group: group._id }).sort({ publishedAt: "desc" }).exec();
  if(articles) {
    return { result: "success", message: "Articles found.", articles: articles };
  } else {
    throw new Error("Could not find articles.")
  }
}

/**
 * Get public articles by author.
 * @function
 * @async
 * @param {AccountsDTO} author - The identifier of the article to be searched.
 * @returns {Promise<ArticlesResultDTO>} - A promise that resolves to null or the article.
 */
export const getPublicArticlesByAuthor = async (
  author: AccountsDTO,
): Promise<ArticlesResultDTO> => {
  const articles = await articlesSchema.find({ publish: true, author: author._id }).sort({ publishedAt: "desc" }).exec();
  if(articles) {
    return { result: "success", message: "Articles found.", articles: articles };
  } else {
    throw new Error("Could not find articles.")
  }
}

/**
 * Get article by id.
 * @function
 * @async
 * @param {string} id - The identifier of the article to be searched.
 * @returns {Promise<ArticleResultDTO>} - A promise that resolves to null or the article.
 */
export const getArticle = async (
  id: string,
): Promise<ArticleResultDTO> => {
  const article = await articlesSchema.findOne({ _id: id }).exec();
  if(article) {
    return { result: "success", message: "Articles found.", article: article };
  } else {
    throw new Error("Could not find articles.")
  }
}

/**
 * Get public article by header.
 * @function
 * @async
 * @param {string} header - The identifier of the article to be searched.
 * @returns {Promise<ArticleResultDTO>} - A promise that resolves to null or the article.
 */
export const getPublicArticleByHeader = async (
  header: string,
): Promise<ArticleResultDTO> => {
  header = decodeURIComponent(header);
  const article = await articlesSchema.findOne({ header: header }).exec();
  if(article) {
    return { result: "success", message: "Articles found.", article: article };
  } else {
    throw new Error("Could not find articles.")
  }
}

/**
 * Get article by group.
 * @function
 * @async
 * @param {GroupsDTO} group - The group identifier of the article to be searched.
 * @returns {Promise<ArticlesResultDTO>} - A promise that resolves to null or the article.
 */
export const getArticlesByGroup = async (
  group: GroupsDTO
): Promise<ArticlesResultDTO> => {
  const articles = await articlesSchema.find({ publish: true, group: group._id }).sort({ publishedAt: "desc" }).exec();
  if(articles) {
    return { result: "success", message: "Articles found.", articles: articles };
  } else {
    throw new Error("Could not find articles.")
  }
}

/**
 * Get article by domain.
 * @function
 * @async
 * @param {string} domain - The domain identifier of the article to be searched.
 * @returns {Promise<ArticlesResultDTO>} - A promise that resolves to null or the article.
 */
export const getArticlesByDomain = async (
  domain: string
): Promise<ArticlesResultDTO> => {
  const articles = await articlesSchema.find({ domain: domain }).sort({ publishedAt: "desc" }).exec();
  if(articles) {
    return { result: "success", message: "Articles found.", articles: articles };
  } else {
    throw new Error("Could not find articles.")
  }
}

/**
 * Get article by group id.
 * @function
 * @async
 * @param {AccountsDTO} group - The account identifier of the article to be searched.
 * @returns {Promise<ArticlesDTO>} - A promise that resolves to null or the article.
 */
export const getArticlesByAuthor = async (
  author: AccountsDTO
): Promise<ArticlesDTO[]> => {
  const articles = await articlesSchema.find({author: author._id}).sort({ publishedAt: "desc" }).exec();
  if(articles) {
    return articles;
  } else {
    throw new Error("Could not find articles.");
  }
}


