import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createClient } from "@supabase/supabase-js";
import { authOptions } from "../../auth/[...nextauth]/route";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

async function isFounder() {
  const session =
    await getServerSession(authOptions);

  if (!session?.user?.discordId) {
    return false;
  }

  const { data: founder } =
    await supabaseAdmin
      .from("profiles")
      .select("discord_id, role")
      .eq("username", "aeli")
      .maybeSingle();

  return (
    !!founder &&
    founder.role === "founder" &&
    founder.discord_id ===
      session.user.discordId
  );
}

export async function GET() {
  const allowed = await isFounder();

  if (!allowed) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const { data: profiles, error } =
    await supabaseAdmin
      .from("profiles")
      .select("id, username, role")
      .order("created_at", {
        ascending: true,
      });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    profiles: profiles || [],
  });
}

export async function POST(
  request: Request
) {
  const allowed = await isFounder();

  if (!allowed) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const body = await request.json();

  const username =
  body.username?.trim().toLowerCase();

const discordId =
  body.discordId?.trim();

const role =
  body.role === "founder"
    ? "founder"
    : "family";

if (
  username &&
  !/^[a-z0-9_-]+$/.test(username)
) {
  return NextResponse.json(
    {
      error:
        "Username can only contain lowercase letters, numbers, hyphens, and underscores.",
    },
    { status: 400 }
  );
}

  if (!username || !discordId) {
    return NextResponse.json(
      {
        error:
          "Username and Discord ID are required.",
      },
      { status: 400 }
    );
  }

  const { data: existing } =
    await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();

  if (existing) {
    return NextResponse.json(
      {
        error:
          "That username already exists.",
      },
      { status: 409 }
    );
  }

  const { error } =
    await supabaseAdmin
      .from("profiles")
      .insert({
        username,
        discord_id: discordId,
        user_id: discordId,
        role,
        avatar_url: "",
        bio: "",
        card_banner_source: "discord",
        card_banner_url: "",
      });

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