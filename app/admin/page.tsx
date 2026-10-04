"use client";

import { useEffect, useState } from "react";

type Profile = {
  id: number;
  username: string;
  role: string;
};

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [discordId, setDiscordId] = useState("");
  const [role, setRole] = useState("family");

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState("");

  async function loadProfiles() {
    try {
      const response = await fetch(
        "/api/admin/profiles"
      );

      const data = await response.json();

      if (response.ok) {
        setProfiles(data.profiles || []);
      }
    } catch {
      console.error(
        "Failed to load profiles."
      );
    }
  }

  useEffect(() => {
    loadProfiles();
  }, []);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/admin/profiles",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            discordId,
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error ||
            "Something went wrong."
        );
        setLoading(false);
        return;
      }

      setMessage(
        "Profile created successfully."
      );

      setUsername("");
      setDiscordId("");
      setRole("family");

      await loadProfiles();
    } catch {
      setMessage(
        "Unable to connect to the server."
      );
    }

    setLoading(false);
  }

  async function removeMember(
    memberUsername: string
  ) {
    const confirmed = window.confirm(
      `Remove ${memberUsername} from Reale?`
    );

    if (!confirmed) {
      return;
    }

    setRemoving(memberUsername);
    setMessage("");

    try {
      const response = await fetch(
        "/api/admin/profiles/delete",
        {
          method: "DELETE",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            username: memberUsername,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error ||
            "Unable to remove member."
        );
        setRemoving("");
        return;
      }

      setMessage(
        `${memberUsername} was removed from Reale.`
      );

      await loadProfiles();
    } catch {
      setMessage(
        "Unable to connect to the server."
      );
    }

    setRemoving("");
  }

  return (
    <main className="admin-page">
      <section className="admin-panel">
        <p className="admin-label">
          REALE ADMIN
        </p>

        <h1>Add Member</h1>

        <p className="admin-description">
          Create a Reale profile for a family
          member.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Username
          </label>

          <input
  type="text"
  value={username}
  onChange={(event) =>
    setUsername(
      event.target.value
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "")
    )
  }
  placeholder="e.g. aeli"
  pattern="[a-z0-9_-]+"
  title="Username can only contain lowercase letters, numbers, hyphens, and underscores."
  required
/>

          <label>
            Discord ID
          </label>

          <input
            type="text"
            value={discordId}
            onChange={(event) =>
              setDiscordId(event.target.value)
            }
            placeholder="Discord User ID"
            required
          />

          <label>
            Role
          </label>

          <select
            value={role}
            onChange={(event) =>
              setRole(event.target.value)
            }
          >
            <option value="family">
              Family
            </option>

            <option value="founder">
              Founder
            </option>
          </select>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Profile"}
          </button>
        </form>

        {message && (
          <p className="admin-message">
            {message}
          </p>
        )}

        <div className="admin-divider" />

        <div className="admin-members">
          <p className="admin-label">
            MEMBERS
          </p>

          <div className="admin-members-header">
  <h2 className="admin-members-heading">
    Manage Members
    <span>
      {profiles.filter(
        (profile) =>
          profile.role !== "founder"
      ).length}
    </span>
  </h2>

  <input
    type="text"
    value={search}
    onChange={(event) =>
      setSearch(event.target.value)
    }
    placeholder="Search members..."
    className="admin-search"
  />
</div>

          <div className="admin-member-list">
            {profiles
  .filter(
    (profile) =>
      profile.role !== "founder"
  )
  .filter((profile) =>
    profile.username
      .toLowerCase()
      .includes(
        search.toLowerCase()
      )
  )
  .map((profile) => (
                <div
                  className="admin-member"
                  key={profile.id}
                >
                  <div>
                    <strong>
                      {profile.username}
                    </strong>

                    <span>
                      Family
                    </span>
                  </div>

                  <button
                    type="button"
                    className="remove-member"
                    onClick={() =>
                      removeMember(
                        profile.username
                      )
                    }
                    disabled={
                      removing ===
                      profile.username
                    }
                  >
                    {removing ===
                    profile.username
                      ? "Removing..."
                      : "Remove"}
                  </button>
                </div>
              ))}

            {profiles.filter(
              (profile) =>
                profile.role !==
                "founder"
            ).length === 0 && (
              <p className="empty-members">
                No family members yet.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}