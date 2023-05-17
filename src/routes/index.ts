import { Router } from "express";
import packages from "./packages";
import auth from "./auth";
import users from "./users";

const routes = Router();
routes.use("/packages", packages);
routes.use("/auth", auth);
routes.use("/user", users);

export default routes;
