import { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { supabase } from "../../lib/supabase";
import { authOptions } from "../api/auth/[...nextauth]/route";
import DiscordProfile from "../DiscordProfile";
import MusicPlayer from "../MusicPlayer";
import DiscordPresence from "../DiscordPresence";

type Profile = {
  username: string;
  bio: string | null;

  theme: string | null;
  accent_color: string | null;

  avatar_url: string | null;
  discord_id: string | null;

  background_url: string | null;
  background_type: string | null;
  background_opacity: number | null;
  background_blur: number | null;
  background_animation: string | null;

  glow_enabled: boolean | null;

  particles_enabled: boolean | null;
  particle_style: string | null;
  particle_amount: number | null;

  card_opacity: number | null;
  card_blur: number | null;
  card_border_opacity: number | null;

  music_url: string | null;
  music_title: string | null;
  music_artist: string | null;
  music_label: string | null;
  music_cover_url: string | null;

  instagram_url: string | null;
  tiktok_url: string | null;
  github_url: string | null;
  youtube_url: string | null;
  spotify_url: string | null;
  twitter_url: string | null;

  custom_url: string | null;
  custom_url_label: string | null;
};

type ProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

export default async function ProfilePage({
  params,
}: ProfilePageProps) {
  const { username } = await params;

  const session =
    await getServerSession(authOptions);

  const { data: profile, error } =
    await supabase
      .from("profiles")
      .select(
        `
        username,
        bio,
        theme,
        accent_color,
        avatar_url,
        discord_id,

        background_url,
        background_type,
        background_opacity,
        background_blur,
        background_animation,

        glow_enabled,

        particles_enabled,
        particle_style,
        particle_amount,

        card_opacity,
        card_blur,
        card_border_opacity,

        music_url,
        music_title,
        music_artist,
        music_label,
        music_cover_url,

        instagram_url,
        tiktok_url,
        github_url,
        youtube_url,
        spotify_url,
        twitter_url,

        custom_url,
        custom_url_label
        `
      )
      .eq(
        "username",
        username.toLowerCase()
      )
      .single();

  if (error || !profile) {
    notFound();
  }

  /* =====================================
     OWNER CHECK
  ===================================== */

  const isOwner =
    session?.user?.discordId ===
    profile.discord_id;

  /* =====================================
     APPEARANCE VALUES
  ===================================== */

  const accentColor =
    profile.accent_color ||
    "#d889b5";

  const backgroundOpacity =
    profile.background_opacity ??
    1;

  const backgroundBlur =
    profile.background_blur ??
    0;

  const backgroundAnimation =
    profile.background_animation ||
    "slow";

  const glowEnabled =
    profile.glow_enabled ??
    true;

  const particlesEnabled =
    profile.particles_enabled ??
    false;

  const particleStyle =
    profile.particle_style ||
    "stars";

  const particleAmount =
    profile.particle_amount ??
    20;

  const cardOpacity =
    profile.card_opacity ??
    0.65;

  const cardBlur =
    profile.card_blur ??
    20;

  const cardBorderOpacity =
    profile.card_border_opacity ??
    0.1;

  /* =====================================
     BACKGROUND
  ===================================== */

  const backgroundStyle: CSSProperties = {
    opacity: backgroundOpacity,
    filter:
      `blur(${backgroundBlur}px)`,
  };

  const hasCustomBackground =
    Boolean(
      profile.background_url &&
      (
        profile.background_type ===
          "image" ||
        profile.background_type ===
          "gif"
      )
    );

  if (hasCustomBackground) {
    backgroundStyle.background =
      `url("${profile.background_url}") center center / cover no-repeat`;

    backgroundStyle.backgroundColor =
      "#080808";
  }

  /* =====================================
     BACKGROUND ANIMATION
  ===================================== */

  let animationClass =
    "background-animation-slow";

  if (
    backgroundAnimation ===
    "off"
  ) {
    animationClass =
      "background-animation-off";
  }

  if (
    backgroundAnimation ===
    "medium"
  ) {
    animationClass =
      "background-animation-medium";
  }

  if (
    backgroundAnimation ===
    "fast"
  ) {
    animationClass =
      "background-animation-fast";
  }

  /* =====================================
     GLOW
  ===================================== */

  const glowClass =
    glowEnabled
      ? "profile-glow-enabled"
      : "profile-glow-disabled";

  /* =====================================
     PARTICLES
  ===================================== */

  const particleSymbols: Record<
    string,
    string
  > = {
    stars: "✦",
    dots: "●",
    hearts: "♡",
  };

  const particleSymbol =
    particleSymbols[
      particleStyle
    ] || "✦";

  const safeParticleAmount =
    Math.min(
      Math.max(
        Number(particleAmount) || 0,
        0
      ),
      100
    );

  const particles =
    Array.from(
      {
        length:
          safeParticleAmount,
      },
      (_, index) => ({
        id: index,

        symbol:
          particleSymbol,

        left:
          `${(index * 37) % 100}%`,

        top:
          `${(index * 61) % 100}%`,

        delay:
          `${(index % 10) * 0.7}s`,

        duration:
          `${6 + (index % 6)}s`,
      })
    );

  /* =====================================
     CARD STYLE
  ===================================== */

  const cardStyle:
    CSSProperties = {
      background:
        `rgba(10, 10, 10, ${cardOpacity})`,

      backdropFilter:
        `blur(${cardBlur}px)`,

      WebkitBackdropFilter:
        `blur(${cardBlur}px)`,

      borderColor:
        `rgba(255, 255, 255, ${cardBorderOpacity})`,
    };

  /* =====================================
     PAGE
  ===================================== */

  return (
    <main
      className={`profile-page ${glowClass}`}
      style={
        {
          "--accent-color":
            accentColor,
        } as CSSProperties
      }
    >

      {/* =================================
          BACKGROUND
      ================================= */}

      <div
        className={
          `profile-background theme-${
            profile.theme ||
            "pink"
          } ${animationClass}`
        }
        style={
          backgroundStyle
        }
      />

      {/* =================================
          PARTICLES
      ================================= */}

      {particlesEnabled && (
        <div
          className="profile-particles"
          aria-hidden="true"
        >
          {particles.map(
            (particle) => (
              <span
                key={
                  particle.id
                }
                className="profile-particle"
                style={{
                  left:
                    particle.left,

                  top:
                    particle.top,

                  animationDelay:
                    particle.delay,

                  animationDuration:
                    particle.duration,
                }}
              >
                {
                  particle.symbol
                }
              </span>
            )
          )}
        </div>
      )}

      {/* =================================
          PROFILE CARD
      ================================= */}

      <div
        className="profile-content"
        style={cardStyle}
      >

        {/* PROFILE */}

        <DiscordProfile
  avatarUrl={
    profile.avatar_url
  }
  name={
    profile.username
  }
  discordId={
    profile.discord_id
  }
/>

        {/* OWNER INDICATOR */}

        {isOwner && (
  <div className="profile-owner-actions">
    <p className="profile-owner-label">
      Profile owner
    </p>

    <a
      href="/edit"
      className="profile-edit-button"
    >
      Edit Profile
    </a>
  </div>
)}

        {/* BIO */}

        <p className="profile-bio">
          {profile.bio}
        </p>

        {/* LIVE DISCORD PRESENCE */}

        {profile.discord_id && (
          <DiscordPresence
            discordId={
              profile.discord_id
            }
          />
        )}

        {/* =================================
            SOCIAL LINKS
        ================================= */}

        <div
          className="social-links"
        >

          {profile.instagram_url && (
            <a
              href={
                profile.instagram_url
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          )}

          {profile.tiktok_url && (
            <a
              href={
                profile.tiktok_url
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              TikTok
            </a>
          )}

          {profile.github_url && (
            <a
              href={
                profile.github_url
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          )}

          {profile.youtube_url && (
            <a
              href={
                profile.youtube_url
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube
            </a>
          )}

          {profile.spotify_url && (
            <a
              href={
                profile.spotify_url
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              Spotify
            </a>
          )}

          {profile.twitter_url && (
            <a
              href={
                profile.twitter_url
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              X / Twitter
            </a>
          )}

          {profile.custom_url && (
            <a
              href={
                profile.custom_url
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              {
                profile.custom_url_label ||
                "Website"
              }
            </a>
          )}

        </div>

        {/* =================================
            MUSIC
        ================================= */}

        {profile.music_url && (
          <MusicPlayer
            musicUrl={
              profile.music_url
            }
            musicTitle={
              profile.music_title
            }
            musicArtist={
              profile.music_artist
            }
            musicLabel={
              profile.music_label
            }
            musicCoverUrl={
              profile.music_cover_url
            }
          />
        )}

        {/* FOOTER */}

        <p
          className="profile-footer"
        >
          REALE
        </p>

      </div>
    </main>
  );
}