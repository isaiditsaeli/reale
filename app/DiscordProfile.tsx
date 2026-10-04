"use client";

import { useEffect, useState } from "react";

type DiscordProfileProps = {
  avatarUrl: string | null;
  name: string;
  discordId: string | null;
};

type DiscordUser = {
  id: string;
  username?: string;
  global_name?: string | null;
  avatar?: string | null;
};

export default function DiscordProfile({
  avatarUrl,
  name,
  discordId,
}: DiscordProfileProps) {
  const [discordUser, setDiscordUser] =
    useState<DiscordUser | null>(null);

  const [loading, setLoading] =
    useState(Boolean(discordId));

  useEffect(() => {
    if (!discordId) {
      setLoading(false);
      return;
    }

    async function loadDiscordProfile() {
      try {
        const response = await fetch(
          `https://api.lanyard.rest/v1/users/${discordId}`
        );

        if (!response.ok) {
          setLoading(false);
          return;
        }

        const data =
          await response.json();

        const user =
          data?.data?.discord_user;

        if (user) {
          setDiscordUser(user);
        }
      } catch (error) {
        console.error(
          "Failed to load Discord profile:",
          error
        );
      }

      setLoading(false);
    }

    loadDiscordProfile();
  }, [discordId]);

  const discordAvatar =
    discordUser?.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png?size=256`
      : null;

  const imageUrl =
    avatarUrl ||
    discordAvatar;

  const discordName =
    discordUser?.global_name ||
    discordUser?.username ||
    name;

  return (
    <>
      <div className="profile-avatar">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${discordName}'s profile`}
          />
        ) : (
          <div className="avatar-placeholder">
            {discordName
              .charAt(0)
              .toUpperCase()}
          </div>
        )}
      </div>

      <h1>{name}</h1>

      {discordUser && (
        <p
          style={{
            fontSize: "12px",
            opacity: 0.5,
          }}
        >
          Discord · {discordName}
        </p>
      )}

      {loading && (
        <p
          style={{
            fontSize: "12px",
            opacity: 0.4,
          }}
        >
          Loading Discord...
        </p>
      )}
    </>
  );
}