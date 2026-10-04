"use client";

import { useState } from "react";

type LivePreviewProps = {
  username: string;
  bio: string;
  avatarUrl: string;

  accentColor: string;
  theme: string;

  backgroundUrl: string;
  backgroundType: string;
  backgroundOpacity: number;
  backgroundBlur: number;

  glowEnabled: boolean;

  particlesEnabled: boolean;
  particleStyle: string;
  particleAmount: number;

  cardOpacity: number;
  cardBlur: number;
  cardBorderOpacity: number;

  musicTitle: string;
  musicArtist: string;
  musicLabel: string;
  musicCoverUrl: string;

  instagramUrl: string;
  tiktokUrl: string;
  githubUrl: string;
  youtubeUrl: string;
  spotifyUrl: string;
  twitterUrl: string;

  customUrl: string;
  customUrlLabel: string;
};

export default function LivePreview({
  username,
  bio,
  avatarUrl,

  accentColor,
  theme,

  backgroundUrl,
  backgroundType,
  backgroundOpacity,
  backgroundBlur,

  glowEnabled,

  particlesEnabled,
  particleStyle,
  particleAmount,

  cardOpacity,
  cardBlur,
  cardBorderOpacity,

  musicTitle,
  musicArtist,
  musicLabel,
  musicCoverUrl,

  instagramUrl,
  tiktokUrl,
  githubUrl,
  youtubeUrl,
  spotifyUrl,
  twitterUrl,

  customUrl,
  customUrlLabel,
}: LivePreviewProps) {
  const [previewMode, setPreviewMode] =
    useState<"desktop" | "mobile">("desktop");

  const themes: Record<string, string> = {
    pink:
      "radial-gradient(circle at 20% 20%, rgba(216,137,181,.25), transparent 30%), radial-gradient(circle at 80% 80%, rgba(111,59,131,.25), transparent 30%), #080808",

    purple:
      "radial-gradient(circle at 20% 20%, rgba(150,100,220,.28), transparent 30%), radial-gradient(circle at 80% 80%, rgba(80,40,140,.25), transparent 30%), #080808",

    blue:
      "radial-gradient(circle at 20% 20%, rgba(70,140,255,.28), transparent 30%), radial-gradient(circle at 80% 80%, rgba(30,70,150,.25), transparent 30%), #080808",

    green:
      "radial-gradient(circle at 20% 20%, rgba(70,180,130,.28), transparent 30%), radial-gradient(circle at 80% 80%, rgba(30,100,70,.25), transparent 30%), #080808",
  };

  const particleSymbols: Record<string, string> = {
    stars: "✦",
    dots: "●",
    hearts: "♡",
  };

  const symbol =
    particleSymbols[particleStyle] || "✦";

  const particles = Array.from(
    {
      length: Math.min(
        Math.max(particleAmount || 0, 0),
        35
      ),
    },
    (_, index) => ({
      id: index,
      left: `${(index * 37) % 100}%`,
      top: `${(index * 61) % 100}%`,
      delay: `${(index % 10) * 0.7}s`,
    })
  );

  const hasBackground =
    backgroundUrl &&
    (backgroundType === "image" ||
      backgroundType === "gif");

  const socialLinks = [
    {
      name: "Instagram",
      url: instagramUrl,
    },
    {
      name: "TikTok",
      url: tiktokUrl,
    },
    {
      name: "GitHub",
      url: githubUrl,
    },
    {
      name: "YouTube",
      url: youtubeUrl,
    },
    {
      name: "Spotify",
      url: spotifyUrl,
    },
    {
      name: "X / Twitter",
      url: twitterUrl,
    },
    {
      name: customUrlLabel || "Website",
      url: customUrl,
    },
  ].filter((link) => link.url);

  return (
    <div
      className="live-preview"
      style={
        {
          "--preview-accent": accentColor,
        } as React.CSSProperties
      }
    >
      {/* HEADER */}

      <div className="live-preview-header">
        <span>LIVE PREVIEW</span>

        <span className="preview-live-dot">
          LIVE
        </span>
      </div>

      {/* DEVICE SWITCH */}

      <div className="preview-device-switch">
        <button
          type="button"
          className={
            previewMode === "desktop"
              ? "active"
              : ""
          }
          onClick={() =>
            setPreviewMode("desktop")
          }
        >
          Desktop
        </button>

        <button
          type="button"
          className={
            previewMode === "mobile"
              ? "active"
              : ""
          }
          onClick={() =>
            setPreviewMode("mobile")
          }
        >
          Mobile
        </button>
      </div>

      {/* PREVIEW */}

      <div
        className={`preview-phone ${
          previewMode === "mobile"
            ? "preview-mobile"
            : "preview-desktop"
        }`}
      >
        <div
          className="preview-background"
          style={{
            background:
              hasBackground
                ? `url("${backgroundUrl}") center center / cover no-repeat`
                : themes[theme] ||
                  themes.pink,

            opacity:
              backgroundOpacity,

            filter:
              `blur(${backgroundBlur}px)`,

            transform:
              "scale(1.05)",
          }}
        />

        {/* PARTICLES */}

        {particlesEnabled && (
          <div className="preview-particles">
            {particles.map(
              (particle) => (
                <span
                  key={particle.id}
                  style={{
                    left:
                      particle.left,
                    top:
                      particle.top,
                    animationDelay:
                      particle.delay,
                  }}
                >
                  {symbol}
                </span>
              )
            )}
          </div>
        )}

        {/* PROFILE CARD */}

        <div
          className="preview-card"
          style={{
            background:
              `rgba(10,10,10,${cardOpacity})`,

            backdropFilter:
              `blur(${cardBlur}px)`,

            WebkitBackdropFilter:
              `blur(${cardBlur}px)`,

            borderColor:
              `rgba(255,255,255,${cardBorderOpacity})`,
          }}
        >
          {/* AVATAR */}

          <div
            className={
              glowEnabled
                ? "preview-avatar preview-glow"
                : "preview-avatar"
            }
            style={{
              borderColor:
                accentColor,

              boxShadow:
                glowEnabled
                  ? `0 0 18px ${accentColor}`
                  : "none",
            }}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
              />
            ) : (
              <span>
                {username
                  ? username
                      .charAt(0)
                      .toUpperCase()
                  : "A"}
              </span>
            )}
          </div>

          {/* NAME */}

          <h2
            style={{
              textShadow:
                glowEnabled
                  ? `0 0 15px ${accentColor}`
                  : "none",
            }}
          >
            {username ||
              "Your Name"}
          </h2>

          {/* BIO */}

          <p className="preview-bio">
            {bio ||
              "Your bio goes here."}
          </p>

          {/* DISCORD */}

          <div className="preview-status">
            <span
              style={{
                background:
                  accentColor,

                boxShadow:
                  `0 0 10px ${accentColor}`,
              }}
            />

            Discord · Online
          </div>

          {/* SOCIALS */}

          {socialLinks.length >
            0 && (
            <div className="preview-socials">
              {socialLinks.map(
                (link) => (
                  <div
                    key={
                      link.name
                    }
                    className="preview-social"
                    style={{
                      borderColor:
                        `color-mix(in srgb, ${accentColor} 45%, transparent)`,

                      background:
                        `color-mix(in srgb, ${accentColor} 10%, transparent)`,
                    }}
                  >
                    {
                      link.name
                    }
                  </div>
                )
              )}
            </div>
          )}

          {/* MUSIC */}

          {musicTitle ||
          musicArtist ||
          musicLabel ||
          musicCoverUrl ? (
            <div
              className="preview-music"
              style={{
                borderColor:
                  `color-mix(in srgb, ${accentColor} 35%, transparent)`,
              }}
            >
              <div
                className="preview-music-cover"
                style={{
                  background:
                    accentColor,
                }}
              >
                {musicCoverUrl ? (
                  <img
                    src={
                      musicCoverUrl
                    }
                    alt="Music cover"
                  />
                ) : (
                  "♪"
                )}
              </div>

              <div className="preview-music-info">
                <span>
                  {musicLabel ||
                    "NOW PLAYING"}
                </span>

                <strong>
                  {musicArtist ||
                    "Reale Music"}
                </strong>

                <small>
                  {musicTitle ||
                    "Still"}
                </small>
              </div>

              <div
                className="preview-play"
                style={{
                  background:
                    accentColor,
                }}
              >
                ▶
              </div>
            </div>
          ) : null}

          {/* FOOTER */}

          <div
            className="preview-footer"
            style={{
              color:
                accentColor,
            }}
          >
            REALE
          </div>
        </div>
      </div>
    </div>
  );
}