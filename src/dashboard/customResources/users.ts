// import { ResourceOptions } from "adminjs";
import { models } from "../../../models";

const users = {
  resource: models.users,
  options: {
    listProperties: ["id", "username", "email"],
    actions: { show: { isVisible: false } },
  },
  // as ResourceOptions,
};

export default users;
