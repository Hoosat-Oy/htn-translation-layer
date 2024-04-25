import { createRouter } from "../../core/server";
import { authenticationRouter } from "./authentication";
import { groupsRouter } from "./groups";
import { membersRouter } from "./members";

const accessRouter = createRouter();

accessRouter.UseRouter(authenticationRouter);
accessRouter.UseRouter(groupsRouter);
accessRouter.UseRouter(membersRouter);

export { accessRouter }