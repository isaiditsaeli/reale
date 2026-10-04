"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "../../lib/supabase";
import LivePreview from "./LivePreview";

export default function EditProfile() {
  const { data: session, status } = useSession();

  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [theme, setTheme] = useState("pink");
  const [accentColor, setAccentColor] = useState("#d889b5");

  // HOMEPAGE BANNER
  const [cardBannerSource, setCardBannerSource] =
    useState("discord");

  const [cardBannerUrl, setCardBannerUrl] =
    useState("");

  // PERSONAL BACKGROUND
  const [backgroundUrl, setBackgroundUrl] = useState("");
  const [backgroundType, setBackgroundType] =
    useState("gradient");
  const [backgroundOpacity, setBackgroundOpacity] =
    useState(1);
  const [backgroundBlur, setBackgroundBlur] =
    useState(0);
  const [backgroundAnimation, setBackgroundAnimation] =
    useState("slow");
  const [glowEnabled, setGlowEnabled] =
    useState(true);

  // EFFECTS
  const [particlesEnabled, setParticlesEnabled] =
    useState(false);
  const [particleStyle, setParticleStyle] =
    useState("stars");
  const [particleAmount, setParticleAmount] =
    useState(20);

  const [cardOpacity, setCardOpacity] =
    useState(0.65);
  const [cardBlur, setCardBlur] =
    useState(20);
  const [cardBorderOpacity, setCardBorderOpacity] =
    useState(0.1);

  // MUSIC
  const [musicUrl, setMusicUrl] = useState("");
  const [musicTitle, setMusicTitle] = useState("");
  const [musicArtist, setMusicArtist] = useState("");
  const [musicLabel, setMusicLabel] = useState("");
  const [musicCoverUrl, setMusicCoverUrl] =
    useState("");

  // SOCIALS
  const [instagramUrl, setInstagramUrl] =
    useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");

  // CUSTOM LINK
  const [customUrl, setCustomUrl] = useState("");
  const [customUrlLabel, setCustomUrlLabel] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!session?.user?.discordId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "bio, avatar_url, theme, accent_color, card_banner_source, card_banner_url, background_url, background_type, background_opacity, background_blur, background_animation, glow_enabled, particles_enabled, particle_style, particle_amount, card_opacity, card_blur, card_border_opacity, music_url, music_title, music_artist, music_label, music_cover_url, instagram_url, tiktok_url, github_url, youtube_url, spotify_url, twitter_url, custom_url, custom_url_label"
        )
        .eq(
          "discord_id",
          session.user.discordId
        )
        .single();

      if (error) {
        console.error(
          "Error loading profile:",
          error
        );
      }

      if (data) {
        setBio(data.bio || "");
        setAvatarUrl(data.avatar_url || "");
        setTheme(data.theme || "pink");
        setAccentColor(
          data.accent_color || "#d889b5"
        );

        // HOMEPAGE BANNER
        setCardBannerSource(
          data.card_banner_source || "discord"
        );

        setCardBannerUrl(
          data.card_banner_url || ""
        );

        // PERSONAL BACKGROUND
        setBackgroundUrl(
          data.background_url || ""
        );

        setBackgroundType(
          data.background_type || "gradient"
        );

        setBackgroundOpacity(
          data.background_opacity ?? 1
        );

        setBackgroundBlur(
          data.background_blur ?? 0
        );

        setBackgroundAnimation(
          data.background_animation || "slow"
        );

        setGlowEnabled(
          data.glow_enabled ?? true
        );

        // EFFECTS
        setParticlesEnabled(
          data.particles_enabled ?? false
        );

        setParticleStyle(
          data.particle_style || "stars"
        );

        setParticleAmount(
          data.particle_amount ?? 20
        );

        setCardOpacity(
          data.card_opacity ?? 0.65
        );

        setCardBlur(
          data.card_blur ?? 20
        );

        setCardBorderOpacity(
          data.card_border_opacity ?? 0.1
        );

        // MUSIC
        setMusicUrl(data.music_url || "");
        setMusicTitle(
          data.music_title || "Still"
        );

        setMusicArtist(
          data.music_artist || "Reale Music"
        );

        setMusicLabel(
          data.music_label || "NOW PLAYING"
        );

        setMusicCoverUrl(
          data.music_cover_url || ""
        );

        // SOCIALS
        setInstagramUrl(
          data.instagram_url || ""
        );

        setTiktokUrl(
          data.tiktok_url || ""
        );

        setGithubUrl(
          data.github_url || ""
        );

        setYoutubeUrl(
          data.youtube_url || ""
        );

        setSpotifyUrl(
          data.spotify_url || ""
        );

        setTwitterUrl(
          data.twitter_url || ""
        );

        // CUSTOM LINK
        setCustomUrl(
          data.custom_url || ""
        );

        setCustomUrlLabel(
          data.custom_url_label || ""
        );
      }

      setLoading(false);
    }

    loadProfile();
  }, [session]);

  async function saveProfile() {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/profile/update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bio,
            avatarUrl,
            theme,
            accentColor,

            // HOMEPAGE BANNER
            cardBannerSource,
            cardBannerUrl,

            // PERSONAL BACKGROUND
            backgroundUrl,
            backgroundType,
            backgroundOpacity,
            backgroundBlur,
            backgroundAnimation,
            glowEnabled,

            // EFFECTS
            particlesEnabled,
            particleStyle,
            particleAmount,

            cardOpacity,
            cardBlur,
            cardBorderOpacity,

            // MUSIC
            musicUrl,
            musicTitle,
            musicArtist,
            musicLabel,
            musicCoverUrl,

            // SOCIALS
            instagramUrl,
            tiktokUrl,
            githubUrl,
            youtubeUrl,
            spotifyUrl,
            twitterUrl,

            // CUSTOM LINK
            customUrl,
            customUrlLabel,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setMessage(
          result.error ||
            "Something went wrong."
        );
        return;
      }

      setMessage(
        "Profile saved successfully."
      );
    } catch (error) {
      console.error(error);
      setMessage(
        "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <main className="editor-page">
        <div className="editor-loading">
          Loading Reale Editor...
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="editor-page">
        <div className="editor-login">
          <h1>Reale Editor</h1>

          <p>
            You must be logged in to edit
            your profile.
          </p>
        </div>
      </main>
    );
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    marginTop: "8px",
    borderRadius: "10px",
    border:
      "1px solid rgba(255,255,255,0.08)",
    background:
      "rgba(255,255,255,0.04)",
    color: "white",
    outline: "none",
  };

  const sectionStyle = {
    padding: "25px",
    borderRadius: "18px",
    border:
      "1px solid rgba(255,255,255,0.07)",
    background:
      "rgba(255,255,255,0.025)",
    marginBottom: "20px",
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    color: "#ddd",
    marginBottom: "18px",
  };

  const rangeStyle = {
    width: "100%",
    marginTop: "10px",
    accentColor,
  };

  return (
    <main
      className="editor-page"
      style={
        {
          "--editor-accent": accentColor,
        } as React.CSSProperties
      }
    >
      <div className="editor-container">

        {/* HEADER */}

        <header className="editor-header">
          <div>
            <p className="editor-eyebrow">
              REALE
            </p>

            <h1>
              Edit Profile
            </h1>

            <p className="editor-subtitle">
              Customize your personal
              Reale profile.
            </p>
          </div>

          <div className="editor-user">
            <span className="editor-user-dot" />

            {session.user.name}
          </div>
        </header>

        {/* TWO COLUMN EDITOR */}

        <div className="editor-layout">

          {/* LEFT SIDE */}

          <div className="editor-form">

            {/* PROFILE */}

            <section style={sectionStyle}>
              <div className="editor-section-title">
                <span>01</span>

                <div>
                  <h2>Profile</h2>

                  <p>
                    Your basic profile
                    information.
                  </p>
                </div>
              </div>

              <label style={labelStyle}>
                Bio

                <textarea
                  value={bio}
                  onChange={(e) =>
                    setBio(e.target.value)
                  }
                  placeholder="Write something about yourself..."
                  style={{
                    ...inputStyle,
                    minHeight: "120px",
                    resize: "vertical",
                  }}
                />
              </label>

              <label style={labelStyle}>
                Profile Picture URL

                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) =>
                    setAvatarUrl(
                      e.target.value
                    )
                  }
                  placeholder="https://..."
                  style={inputStyle}
                />
              </label>
            </section>

            {/* HOMEPAGE BANNER */}

            <section style={sectionStyle}>
              <div className="editor-section-title">
                <span>02</span>

                <div>
                  <h2>
                    Homepage Banner
                  </h2>

                  <p>
                    Choose what appears
                    on your Reale family
                    card.
                  </p>
                </div>
              </div>

              <label style={labelStyle}>
                Banner Source

                <select
                  value={
                    cardBannerSource
                  }
                  onChange={(e) =>
                    setCardBannerSource(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                >
                  <option value="discord">
                    Discord Banner
                  </option>

                  <option value="custom">
                    Custom Image / GIF
                  </option>
                </select>
              </label>

              {cardBannerSource ===
                "discord" && (
                <div
                  style={{
                    padding: "14px",
                    borderRadius: "12px",
                    background:
                      "rgba(255,255,255,0.04)",
                    border:
                      "1px solid rgba(255,255,255,0.06)",
                    color: "#aaa",
                    fontSize: "13px",
                    lineHeight: 1.6,
                  }}
                >
                  Your Reale homepage
                  card will automatically
                  use your Discord banner
                  when one is available.

                  <br />
                  <br />

                  If you don't have a
                  Discord banner, Reale
                  will use its default
                  banner instead.
                </div>
              )}

              {cardBannerSource ===
                "custom" && (
                <>
                  <label
                    style={labelStyle}
                  >
                    Custom Banner URL

                    <input
                      type="text"
                      value={
                        cardBannerUrl
                      }
                      onChange={(e) =>
                        setCardBannerUrl(
                          e.target.value
                        )
                      }
                      placeholder="https://example.com/banner.gif"
                      style={inputStyle}
                    />
                  </label>

                  <div
                    style={{
                      marginTop: "12px",
                      padding: "12px",
                      borderRadius: "12px",
                      background:
                        "rgba(255,255,255,0.03)",
                      color: "#999",
                      fontSize: "12px",
                    }}
                  >
                    Supports normal
                    images and GIFs.
                  </div>

                  {cardBannerUrl && (
                    <div
                      style={{
                        marginTop: "15px",
                        borderRadius: "14px",
                        overflow:
                          "hidden",
                        border:
                          "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <img
                        src={
                          cardBannerUrl
                        }
                        alt="Homepage banner preview"
                        style={{
                          display: "block",
                          width: "100%",
                          height: "140px",
                          objectFit:
                            "cover",
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </section>

            {/* APPEARANCE */}

            <section style={sectionStyle}>
              <div className="editor-section-title">
                <span>03</span>

                <div>
                  <h2>Appearance</h2>

                  <p>
                    Control the colors
                    and background.
                  </p>
                </div>
              </div>

              <label style={labelStyle}>
                Theme

                <select
                  value={theme}
                  onChange={(e) =>
                    setTheme(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                >
                  <option value="pink">
                    Pink
                  </option>

                  <option value="purple">
                    Purple
                  </option>

                  <option value="blue">
                    Blue
                  </option>

                  <option value="green">
                    Green
                  </option>
                </select>
              </label>

              <label style={labelStyle}>
                Accent Color

                <div className="color-picker-row">
                  <input
                    type="color"
                    value={
                      accentColor
                    }
                    onChange={(e) =>
                      setAccentColor(
                        e.target.value
                      )
                    }
                    className="editor-color-picker"
                  />

                  <span>
                    {accentColor}
                  </span>
                </div>
              </label>

              <label style={labelStyle}>
                Background Type

                <select
                  value={
                    backgroundType
                  }
                  onChange={(e) =>
                    setBackgroundType(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                >
                  <option value="gradient">
                    Theme Gradient
                  </option>

                  <option value="image">
                    Image
                  </option>

                  <option value="gif">
                    GIF
                  </option>
                </select>
              </label>

              <label style={labelStyle}>
                Background Image /
                GIF URL

                <input
                  type="text"
                  value={
                    backgroundUrl
                  }
                  onChange={(e) =>
                    setBackgroundUrl(
                      e.target.value
                    )
                  }
                  placeholder="https://example.com/background.gif"
                  style={inputStyle}
                />
              </label>

              <label style={labelStyle}>
                Background Opacity:{" "}
                {Math.round(
                  backgroundOpacity *
                    100
                )}
                %

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={
                    backgroundOpacity
                  }
                  onChange={(e) =>
                    setBackgroundOpacity(
                      Number(
                        e.target.value
                      )
                    )
                  }
                  style={rangeStyle}
                />
              </label>

              <label style={labelStyle}>
                Background Blur:{" "}
                {backgroundBlur}px

                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={
                    backgroundBlur
                  }
                  onChange={(e) =>
                    setBackgroundBlur(
                      Number(
                        e.target.value
                      )
                    )
                  }
                  style={rangeStyle}
                />
              </label>

              <label style={labelStyle}>
                Background Animation

                <select
                  value={
                    backgroundAnimation
                  }
                  onChange={(e) =>
                    setBackgroundAnimation(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                >
                  <option value="off">
                    Off
                  </option>

                  <option value="slow">
                    Slow
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="fast">
                    Fast
                  </option>
                </select>
              </label>

              <label className="editor-toggle">
                <input
                  type="checkbox"
                  checked={
                    glowEnabled
                  }
                  onChange={(e) =>
                    setGlowEnabled(
                      e.target.checked
                    )
                  }
                />

                <span>
                  <strong>
                    Glow Effects
                  </strong>

                  <small>
                    Add glowing effects
                    around your profile.
                  </small>
                </span>
              </label>
            </section>

            {/* EFFECTS */}

            <section style={sectionStyle}>
              <div className="editor-section-title">
                <span>04</span>

                <div>
                  <h2>Effects</h2>

                  <p>
                    Add animated
                    elements to your
                    profile.
                  </p>
                </div>
              </div>

              <label className="editor-toggle">
                <input
                  type="checkbox"
                  checked={
                    particlesEnabled
                  }
                  onChange={(e) =>
                    setParticlesEnabled(
                      e.target.checked
                    )
                  }
                />

                <span>
                  <strong>
                    Particles
                  </strong>

                  <small>
                    Display floating
                    particles in the
                    background.
                  </small>
                </span>
              </label>

              <br />

              <label style={labelStyle}>
                Particle Style

                <select
                  value={
                    particleStyle
                  }
                  onChange={(e) =>
                    setParticleStyle(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                >
                  <option value="stars">
                    ✦ Stars
                  </option>

                  <option value="dots">
                    ● Dots
                  </option>

                  <option value="hearts">
                    ♡ Hearts
                  </option>
                </select>
              </label>

              <label style={labelStyle}>
                Particle Amount:{" "}
                {particleAmount}

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={
                    particleAmount
                  }
                  onChange={(e) =>
                    setParticleAmount(
                      Number(
                        e.target.value
                      )
                    )
                  }
                  style={rangeStyle}
                />
              </label>

              <div className="editor-subsection">
                <h3>
                  Glass Card
                </h3>

                <label style={labelStyle}>
                  Card Opacity:{" "}
                  {cardOpacity}

                  <input
                    type="range"
                    min="0.2"
                    max="0.95"
                    step="0.05"
                    value={
                      cardOpacity
                    }
                    onChange={(e) =>
                      setCardOpacity(
                        Number(
                          e.target.value
                        )
                      )
                    }
                    style={rangeStyle}
                  />
                </label>

                <label style={labelStyle}>
                  Card Blur:{" "}
                  {cardBlur}px

                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={
                      cardBlur
                    }
                    onChange={(e) =>
                      setCardBlur(
                        Number(
                          e.target.value
                        )
                      )
                    }
                    style={rangeStyle}
                  />
                </label>

                <label style={labelStyle}>
                  Border Opacity:{" "}
                  {cardBorderOpacity}

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={
                      cardBorderOpacity
                    }
                    onChange={(e) =>
                      setCardBorderOpacity(
                        Number(
                          e.target.value
                        )
                      )
                    }
                    style={rangeStyle}
                  />
                </label>
              </div>
            </section>

            {/* MUSIC */}

            <section style={sectionStyle}>
              <div className="editor-section-title">
                <span>05</span>

                <div>
                  <h2>Music</h2>

                  <p>
                    Customize the music
                    player.
                  </p>
                </div>
              </div>

              <label style={labelStyle}>
                Music URL

                <input
                  type="text"
                  value={musicUrl}
                  onChange={(e) =>
                    setMusicUrl(
                      e.target.value
                    )
                  }
                  placeholder="https://example.com/song.mp3"
                  style={inputStyle}
                />
              </label>

              <label style={labelStyle}>
                Music Title

                <input
                  type="text"
                  value={musicTitle}
                  onChange={(e) =>
                    setMusicTitle(
                      e.target.value
                    )
                  }
                  placeholder="Still"
                  style={inputStyle}
                />
              </label>

              <label style={labelStyle}>
                Artist

                <input
                  type="text"
                  value={musicArtist}
                  onChange={(e) =>
                    setMusicArtist(
                      e.target.value
                    )
                  }
                  placeholder="Reale Music"
                  style={inputStyle}
                />
              </label>

              <label style={labelStyle}>
                Player Label

                <input
                  type="text"
                  value={musicLabel}
                  onChange={(e) =>
                    setMusicLabel(
                      e.target.value
                    )
                  }
                  placeholder="NOW PLAYING"
                  style={inputStyle}
                />
              </label>

              <label style={labelStyle}>
                Music Cover URL

                <input
                  type="text"
                  value={
                    musicCoverUrl
                  }
                  onChange={(e) =>
                    setMusicCoverUrl(
                      e.target.value
                    )
                  }
                  placeholder="https://example.com/cover.jpg"
                  style={inputStyle}
                />
              </label>
            </section>

            {/* SOCIALS */}

            <section style={sectionStyle}>
              <div className="editor-section-title">
                <span>06</span>

                <div>
                  <h2>
                    Social Links
                  </h2>

                  <p>
                    Connect your social
                    media accounts.
                  </p>
                </div>
              </div>

              <label style={labelStyle}>
                Instagram

                <input
                  type="text"
                  value={
                    instagramUrl
                  }
                  onChange={(e) =>
                    setInstagramUrl(
                      e.target.value
                    )
                  }
                  placeholder="https://instagram.com/..."
                  style={inputStyle}
                />
              </label>

              <label style={labelStyle}>
                TikTok

                <input
                  type="text"
                  value={
                    tiktokUrl
                  }
                  onChange={(e) =>
                    setTiktokUrl(
                      e.target.value
                    )
                  }
                  placeholder="https://tiktok.com/@..."
                  style={inputStyle}
                />
              </label>

              <label style={labelStyle}>
                GitHub

                <input
                  type="text"
                  value={
                    githubUrl
                  }
                  onChange={(e) =>
                    setGithubUrl(
                      e.target.value
                    )
                  }
                  placeholder="https://github.com/..."
                  style={inputStyle}
                />
              </label>

              <label style={labelStyle}>
                YouTube

                <input
                  type="text"
                  value={
                    youtubeUrl
                  }
                  onChange={(e) =>
                    setYoutubeUrl(
                      e.target.value
                    )
                  }
                  placeholder="https://youtube.com/..."
                  style={inputStyle}
                />
              </label>

              <label style={labelStyle}>
                Spotify

                <input
                  type="text"
                  value={
                    spotifyUrl
                  }
                  onChange={(e) =>
                    setSpotifyUrl(
                      e.target.value
                    )
                  }
                  placeholder="https://open.spotify.com/..."
                  style={inputStyle}
                />
              </label>

              <label style={labelStyle}>
                X / Twitter

                <input
                  type="text"
                  value={
                    twitterUrl
                  }
                  onChange={(e) =>
                    setTwitterUrl(
                      e.target.value
                    )
                  }
                  placeholder="https://x.com/..."
                  style={inputStyle}
                />
              </label>
            </section>

            {/* CUSTOM LINK */}

            <section style={sectionStyle}>
              <div className="editor-section-title">
                <span>07</span>

                <div>
                  <h2>
                    Custom Link
                  </h2>

                  <p>
                    Add another personal
                    link.
                  </p>
                </div>
              </div>

              <label style={labelStyle}>
                Link Name

                <input
                  type="text"
                  value={
                    customUrlLabel
                  }
                  onChange={(e) =>
                    setCustomUrlLabel(
                      e.target.value
                    )
                  }
                  placeholder="Portfolio"
                  style={inputStyle}
                />
              </label>

              <label style={labelStyle}>
                Link URL

                <input
                  type="text"
                  value={
                    customUrl
                  }
                  onChange={(e) =>
                    setCustomUrl(
                      e.target.value
                    )
                  }
                  placeholder="https://example.com"
                  style={inputStyle}
                />
              </label>
            </section>

            {/* SAVE */}

            <div className="editor-save-area">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="editor-save-button"
                style={{
                  background:
                    accentColor,
                }}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              {message && (
                <p className="editor-message">
                  {message}
                </p>
              )}
            </div>
          </div>

          {/* RIGHT SIDE — LIVE PREVIEW */}

          <aside className="editor-preview-column">
            <LivePreview
              username={
                session.user.name ||
                "Aeli"
              }
              bio={bio}
              avatarUrl={avatarUrl}
              accentColor={
                accentColor
              }
              theme={theme}
              backgroundUrl={
                backgroundUrl
              }
              backgroundType={
                backgroundType
              }
              backgroundOpacity={
                backgroundOpacity
              }
              backgroundBlur={
                backgroundBlur
              }
              glowEnabled={
                glowEnabled
              }
              particlesEnabled={
                particlesEnabled
              }
              particleStyle={
                particleStyle
              }
              particleAmount={
                particleAmount
              }
              cardOpacity={
                cardOpacity
              }
              cardBlur={
                cardBlur
              }
              cardBorderOpacity={
                cardBorderOpacity
              }
              musicTitle={
                musicTitle
              }
              musicArtist={
                musicArtist
              }
              musicLabel={
                musicLabel
              }
              musicCoverUrl={
                musicCoverUrl
              }
              instagramUrl={
                instagramUrl
              }
              tiktokUrl={
                tiktokUrl
              }
              githubUrl={
                githubUrl
              }
              youtubeUrl={
                youtubeUrl
              }
              spotifyUrl={
                spotifyUrl
              }
              twitterUrl={
                twitterUrl
              }
              customUrl={
                customUrl
              }
              customUrlLabel={
                customUrlLabel
              }
            />
          </aside>
        </div>
      </div>
    </main>
  );
}