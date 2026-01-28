import{ PermissionResolver } from "./permissionResolver";

const ctx = (roles: any[]) => ({userId: "u1", roles})

test("developer can write repo", () => {
    const r = PermissionResolver.forUser({userId: "u1", roles: ["DEVELOPER"]});
    expect(r.can("write:repo")).toBe(true);
});

test("viewer cannot write repo", () => {
    const r = PermissionResolver.forUser({userId: "u2", roles: ["VIEWER"]});
    expect(r.can("write:repo")).toBe(false);
});

test("dedupes permissions across roles (list unique)"), () => {
    const r = PermissionResolver.forUser(ctx(["ADMIN", "DEVELOPER"]));
    const list = r.list();
    expect(new Set(list).size).toBe(list.length);
}
