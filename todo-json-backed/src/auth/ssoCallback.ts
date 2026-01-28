export async function ssoCallback(code: string) {
    console.log("SSO callback code:", code);
    const r = await fetch("/api/sso/callback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code }),
        credentials: "include",
    });
    console.log("status:", r.status, "set-cookie", r.headers.get("set-cookie"));
    if (!r.ok) throw new Error ("SSO callback failed");
    return r.json();
}