import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createClient } from "@supabase/supabase-js";
import { authOptions } from "../../auth/[...nextauth]/route";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export async function POST(request: Request) {
  const session =
    await getServerSession(authOptions);

  if (!session?.user?.discordId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json();

  const bio = body.bio ?? "";
  const avatarUrl = body.avatarUrl ?? "";
  const theme = body.theme ?? "pink";
  const accentColor =
    body.accentColor ?? "#d889b5";

  /* HOMEPAGE BANNER */

  const cardBannerSource =
    body.cardBannerSource ?? "discord";

  const cardBannerUrl =
    body.cardBannerUrl ?? "";

  /* PERSONAL APPEARANCE */

  const backgroundUrl =
    body.backgroundUrl ?? "";

  const backgroundType =
    body.backgroundType ?? "gradient";

  const backgroundOpacity =
    body.backgroundOpacity ?? 1;

  const backgroundBlur =
    body.backgroundBlur ?? 0;

  const backgroundAnimation =
    body.backgroundAnimation ?? "slow";

  const glowEnabled =
    body.glowEnabled ?? true;

  const particlesEnabled =
    body.particlesEnabled ?? false;

  const particleStyle =
    body.particleStyle ?? "stars";

  const particleAmount =
    body.particleAmount ?? 20;

  const cardOpacity =
    body.cardOpacity ?? 0.65;

  const cardBlur =
    body.cardBlur ?? 20;

  const cardBorderOpacity =
    body.cardBorderOpacity ?? 0.1;

  /* MUSIC */

  const musicUrl =
    body.musicUrl ?? "";

  const musicTitle =
    body.musicTitle ?? "Still";

  const musicArtist =
    body.musicArtist ?? "Reale Music";

  const musicLabel =
    body.musicLabel ?? "NOW PLAYING";

  const musicCoverUrl =
    body.musicCoverUrl ?? "";

  /* SOCIALS */

  const instagramUrl =
    body.instagramUrl ?? "";

  const tiktokUrl =
    body.tiktokUrl ?? "";

  const githubUrl =
    body.githubUrl ?? "";

  const youtubeUrl =
    body.youtubeUrl ?? "";

  const spotifyUrl =
    body.spotifyUrl ?? "";

  const twitterUrl =
    body.twitterUrl ?? "";

  /* CUSTOM LINK */

  const customUrl =
    body.customUrl ?? "";

  const customUrlLabel =
    body.customUrlLabel ?? "";

  /* SAVE */

  const { error } =
    await supabaseAdmin
      .from("profiles")
      .update({
        bio,
        avatar_url: avatarUrl,

        theme,
        accent_color: accentColor,

        // Homepage banner
        card_banner_source:
          cardBannerSource,
        card_banner_url:
          cardBannerUrl,

        // Personal appearance
        background_url:
          backgroundUrl,
        background_type:
          backgroundType,
        background_opacity:
          backgroundOpacity,
        background_blur:
          backgroundBlur,
        background_animation:
          backgroundAnimation,

        glow_enabled:
          glowEnabled,

        particles_enabled:
          particlesEnabled,
        particle_style:
          particleStyle,
        particle_amount:
          particleAmount,

        card_opacity:
          cardOpacity,
        card_blur:
          cardBlur,
        card_border_opacity:
          cardBorderOpacity,

        // Music
        music_url:
          musicUrl,
        music_title:
          musicTitle,
        music_artist:
          musicArtist,
        music_label:
          musicLabel,
        music_cover_url:
          musicCoverUrl,

        // Socials
        instagram_url:
          instagramUrl,
        tiktok_url:
          tiktokUrl,
        github_url:
          githubUrl,
        youtube_url:
          youtubeUrl,
        spotify_url:
          spotifyUrl,
        twitter_url:
          twitterUrl,

        // Custom link
        custom_url:
          customUrl,
        custom_url_label:
          customUrlLabel,
      })
      .eq(
        "discord_id",
        session.user.discordId
      );

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}