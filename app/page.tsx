import Link from "next/link";
import { getServerSession } from "next-auth";

import AccountMenu from "./AccountMenu";
import { supabase } from "../lib/supabase";
import { authOptions } from "./api/auth/[...nextauth]/route";

type DiscordUser = {
  id: string;
  banner?: string | null;
  avatar?: string | null;
};

async function getDiscordBanner(discordId: string) {
  try {
    const response = await fetch(
      `https://api.lanyard.rest/v1/users/${discordId}`,
      {
        next: {
          revalidate: 60,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    const user: DiscordUser | undefined =
      data?.data?.discord_user;

    if (!user) {
      return null;
    }

    const bannerUrl = user.banner
      ? `https://cdn.discordapp.com/banners/${
          user.id
        }/${user.banner}.${
          user.banner.startsWith("a_")
            ? "gif"
            : "png"
        }?size=1024`
      : null;

    const avatarUrl = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`
      : null;

    return {
      bannerUrl,
      avatarUrl,
    };
  } catch {
    return null;
  }
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select(
      "username, role, avatar_url, discord_id, card_banner_url, card_banner_source"
    )
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to load profiles:", error);
  }

  const allProfiles = profiles || [];

  const founders = allProfiles.filter(
    (profile) => profile.role === "founder"
  );

  const family = allProfiles.filter(
    (profile) => profile.role === "family"
  );

 async function prepareProfile(profile: any) {
  let bannerUrl = profile.card_banner_url;
  let discordAvatarUrl = null;

  const discordData = await getDiscordBanner(
    profile.discord_id
  );

  if (profile.card_banner_source !== "custom") {
    if (discordData?.bannerUrl) {
      bannerUrl = discordData.bannerUrl;
    }
  }

  if (discordData?.avatarUrl) {
    discordAvatarUrl = discordData.avatarUrl;
  }

  return {
    username: profile.username,
    role: profile.role,
    avatar_url: profile.avatar_url,
    discordAvatarUrl,
    bannerUrl,
  };
}

  const foundersWithBanners = await Promise.all(
    founders.map(prepareProfile)
  );

  const familyWithBanners = await Promise.all(
    family.map(prepareProfile)
  );

  function ProfileCard({
    profile,
    founder = false,
  }: {
    profile: any;
    founder?: boolean;
  }) {
    return (
      <Link
        href={`/${profile.username}`}
        className={`profile-card banner-card ${
          founder
            ? "founder-card"
            : "family-card"
        }`}
      >
        <div className="card-banner">
          {profile.bannerUrl ? (
            <img
              src={profile.bannerUrl}
              alt={`${profile.username} banner`}
              className="card-banner-image"
            />
          ) : (
            <div className="card-banner-placeholder">
              REALE
            </div>
          )}
        </div>

        <div className="card-content">
          <div className="avatar">
  {profile.avatar_url ? (
    <img
      src={profile.avatar_url}
      alt={profile.username}
    />
  ) : profile.discordAvatarUrl ? (
    <img
      src={profile.discordAvatarUrl}
      alt={profile.username}
    />
  ) : (
    profile.username
      .charAt(0)
      .toUpperCase()
  )}
</div>

          <h2>{profile.username}</h2>

          <p>
            {founder
              ? "Founder"
              : "View Profile"}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <main className="home">
      <div className="hero">

        {/* ACCOUNT */}
<div className="home-account">
  {session?.user?.discordId ? (
    <AccountMenu
  name={session.user.name}
  image={session.user.image}
/>
  ) : (
    <Link
      href="/api/auth/signin/discord"
      className="discord-login"
    >
      <span className="discord-login-icon">
        ◈
      </span>

      <span>
        Login with Discord
      </span>
    </Link>
  )}
</div>

        {/* REALE */}
        <p className="small-text">
          A PLACE LIKE HOME.
        </p>

        <h1>REALE</h1>

        {/* FOUNDER */}
        {foundersWithBanners.length > 0 && (
          <section className="head-section">
            <h2 className="section-title">
              FOUNDER
            </h2>

            <div className="profiles founder-profiles">
              {foundersWithBanners.map(
                (profile) => (
                  <ProfileCard
                    key={profile.username}
                    profile={profile}
                    founder
                  />
                )
              )}
            </div>
          </section>
        )}

        {/* FAMILY */}
        <section className="members-section">
          <h2 className="section-title">
            FAMILY
          </h2>

          {familyWithBanners.length > 0 ? (
            <div className="profiles">
              {familyWithBanners.map(
                (profile) => (
                  <ProfileCard
                    key={profile.username}
                    profile={profile}
                  />
                )
              )}
            </div>
          ) : (
            <p className="description">
              No family members yet.
            </p>
          )}
        </section>

      </div>
    </main>
  );
}