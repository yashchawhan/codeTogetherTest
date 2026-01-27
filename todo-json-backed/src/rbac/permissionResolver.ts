import { Permission, UserContext } from "./types";

const ROLE_PERMS: Record<string, Permission[]> = {
    ADMIN: ["read:repo", "write:repo", "delete:repo", "read:project", "write:project", "delete:project", "read:settings", "write:settings", "delete:settings"],
    MAINTAINER: ["read:repo", "write:repo", "read:project", "write:project", "read:settings"],
    DEVELOPER: ["read:repo", "write:repo", "read:project", "write:project"],
    VIEWER: ["read:repo", "read:project"]
}

// rename resolveResolvePermissions -> getEffectivePermissions

// delete getEffectivePermissions

// add PermissionPolicy interface

// delete PermissionPolicy interface

// now accept checks

// delete checks

// final version
export type PermissionCheck = {perm: Permission; reason?: string};

export class PermissionResolver {
    private readonly permissions: Set<Permission>;

    private constructor(perms: Set<Permission>) {
        this.permissions = perms;
    }

    static forUser(ctx: UserContext): PermissionResolver {
        const perms = new Set<Permission>();
        for (const role of ctx.roles) {
            for (const p of ROLE_PERMS[role] ?? []) perms.add(p);
        }
        return new PermissionResolver(perms);
    }

    can(perm: Permission): boolean {
        return this.permissions.has(perm);
    }

    canAll(perms: Permission[]): boolean {
        return perms.every((p) => this.permissions.has(p));
    }

    canAny(perms:Permission[]): boolean {
        return perms.some((p) => this.permissions.has(p));
    }

    list(): Permission[]{
        return Array.from(this.permissions);
    }

    explain(checks: PermissionCheck[]): Array<PermissionCheck & { allowed: boolean }> {
    return checks.map((c) => ({ ...c, allowed: this.permissions.has(c.perm) }));
}
}