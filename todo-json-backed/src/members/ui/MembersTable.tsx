import { useEffect, useState } from "react";
import { getMembers, Member } from "../api/members";

const fmt = (iso?: string) => (iso ? new Date(iso).toLocaleDateString() : "—");

export function MembersTable({workspaceId}: {workspaceId: string}){
    const [rows, setRows] = useState<Member[]>([]);

    useEffect(() => {getMembers(workspaceId).then(setRows); }, [workspaceId]);

    return (
        <table>
            <thead>
                <tr><th>Name</th><th>Last Active</th></tr>
            </thead>
            <tbody>
                {rows.map(m => (
                    <tr key={m.id}>
                        <td>{m.name}</td>
                        <td>{fmt(m.lastActiveAt)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
