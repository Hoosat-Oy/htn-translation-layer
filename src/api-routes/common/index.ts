import { createRouter } from "../../core/server";
import { contactRouter } from "./contact";
const commonRouter = createRouter();

commonRouter.UseRouter(contactRouter);

export { commonRouter }