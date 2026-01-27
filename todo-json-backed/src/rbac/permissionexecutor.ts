import { PermissionResolver } from "./permissionResolver";
import { UserContext} from "./types";

const ctx:UserContext = {userId: "u1", roles: ["DEVELOPER"]};
const r = PermissionResolver.forUser(ctx);

r.can("write:repo"); //true
r.can("delete:settings"); //false
r.canAll(["read:repo", "write:repo"]); // true
