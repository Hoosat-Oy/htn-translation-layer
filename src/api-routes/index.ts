import { createRouter } from "../core/server";
import { accessRouter } from "./access";
import { addressesRouter } from "./addresses";

const APIRouter = createRouter();

APIRouter.UseRouter(accessRouter);
APIRouter.UseRouter(addressesRouter);

export { APIRouter };
