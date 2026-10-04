import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createClient } from "@supabase/supabase-js";
import { authOptions } from "../../../auth/[...nextauth]/route";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.discordId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Make sure the logged-in user is the Reale founder.
  const { data: founder } = await supabaseAdmin
    .from("profiles")
    .select("discord_id, role")
    .eq("username", "aeli")
    .maybeSingle();

  if (
    !founder ||
    founder.role !== "founder" ||
    founder.discord_id !== session.user.discordId
  ) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const username = body.username?.trim();

  if (!username) {
    return NextResponse.json(
      { error: "Username is required." },
      { status: 400 }
    );
  }

  // Never allow the founder to delete themselves.
  if (username.toLowerCase() === "aeli") {
    return NextResponse.json(
      {
        error:
          "The founder profile cannot be deleted.",
      },
      { status: 403 }
    );
  }

  // Make sure the profile actually exists.
  const { data: profile } =
    await supabaseAdmin
      .from("profiles")
      .select("id, username")
      .eq("username", username)
      .maybeSingle();

  if (!profile) {
    return NextResponse.json(
      { error: "Profile not found." },
      { status: 404 }
    );
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .delete()
    .eq("id", profile.id);

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