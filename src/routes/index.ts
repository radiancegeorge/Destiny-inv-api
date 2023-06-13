import { Router } from "express";
import packages from "./packages";
import auth from "./auth";
import users from "./users";
import vendor from "./vendors";

const routes = Router();
routes.use("/packages", packages);
routes.use("/auth", auth);
routes.use("/user", users);
routes.use("/vendors", vendor);

export default routes;
