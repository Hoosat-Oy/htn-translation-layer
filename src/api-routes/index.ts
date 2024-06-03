import { createRouter } from "../core/server";
import { accessRouter } from "./access";

const APIRouter = createRouter();

APIRouter.UseRouter(accessRouter);

export { APIRouter };
