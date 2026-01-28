import{ PermissionResolver } from "./permissionResolver";

test("developer can write repo", () => {
    const r = PermissionResolver.forUser({userId: "u1", roles: ["DEVELOPER"]});
    expect(r.can("write:repo")).toBe(true);
});

test("viewer cannot write repo", () => {
    const r = PermissionResolver.forUser({userId: "u2", roles: ["VIEWER"]});
    expect(r.can("write:repo")).toBe(false);
});