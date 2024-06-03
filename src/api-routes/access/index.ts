import { createRouter } from "../../core/server";
import { authenticationRouter } from "./authentication";

const accessRouter = createRouter();

accessRouter.UseRouter(authenticationRouter);

export { accessRouter };
