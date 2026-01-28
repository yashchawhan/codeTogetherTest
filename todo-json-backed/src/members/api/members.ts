export type Member = { id: string; name: string; lastActiveAt?: string};

export async function getMembers(workspaceId: string): Promise<Member[]>{
    const r = await fetch(`/api/workspaces/${workspaceId}/members`);
    const data = await r.json();
    return data.members as Member[];
}

