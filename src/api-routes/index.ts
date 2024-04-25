import { createRouter } from "../core/server";
import { commonRouter } from "./common";

const APIRouter = createRouter();

APIRouter.UseRouter(commonRouter);

export { APIRouter }