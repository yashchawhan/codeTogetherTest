export type Action = "read" | "write" | "delete";
export type Resource = "repo" | "project" | "settings";

export type Role = "ADMIN" | "MAINTAINER" | "DEVELOPER" | "VIEWER";

export type Permission = `${Action}:${Resource}`;

export interface UserContext{
    userId: string;
    roles: Role[];
}