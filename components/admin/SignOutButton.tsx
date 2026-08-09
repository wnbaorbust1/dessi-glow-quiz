"use client";

export default function SignOutButton() {
  async function handleSignOut() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    document.location.replace("/admin/login");
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="rounded-sm px-3 py-1.5 text-xs transition-opacity hover:opacity-80"
      style={{ border: "1px solid rgba(198,160,107,0.3)", color: "#8a7a6e" }}
    >
      Sign out
    </button>
  );
}
