"use client";

import { useEffect, useState } from "react";

type DiscordPresenceProps = {
  discordId: string;
};

type Activity = {
  name: string;
  details?: string | null;
  state?: string | null;
  type: number;
  assets?: {
    large_image?: string | null;
    large_text?: string | null;
    small_image?: string | null;
    small_text?: string | null;
  };
};

type LanyardData = {
  discord_status: string;
  activities: Activity[];
};

export default function DiscordPresence({
  discordId,
}: DiscordPresenceProps) {
  const [presence, setPresence] =
    useState<LanyardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!discordId) {
      setLoading(false);
      return;
    }

    const socket = new WebSocket(
      "wss://api.lanyard.rest/socket"
    );

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          op: 2,
          d: {
            subscribe_to_id: discordId,
          },
        })
      );
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(
          event.data
        );

        if (
          message.op === 0 &&
          message.t === "INIT_STATE"
        ) {
          setPresence(message.d);
          setLoading(false);
        }

        if (
          message.op === 0 &&
          message.t ===
            "PRESENCE_UPDATE"
        ) {
          setPresence(message.d);
          setLoading(false);
        }
      } catch (error) {
        console.error(
          "Lanyard message error:",
          error
        );
      }
    };

    socket.onerror = () => {
      setLoading(false);
    };

    socket.onclose = () => {
      console.log(
        "Lanyard connection closed."
      );
    };

    return () => {
      socket.close();
    };
  }, [discordId]);

  if (loading) {
    return (
      <div className="discord-card">
        <div className="discord-card-status">
          <span className="presence-dot offline" />
          Loading Discord...
        </div>
      </div>
    );
  }

  if (!presence) {
    return (
      <div className="discord-card">
        <div className="discord-card-status">
          <span className="presence-dot offline" />
          Discord unavailable
        </div>
      </div>
    );
  }

  const status =
    presence.discord_status ||
    "offline";

  const statusLabels: Record<
    string,
    string
  > = {
    online: "Online",
    idle: "Idle",
    dnd: "Do Not Disturb",
    offline: "Offline",
  };

  const statusLabel =
    statusLabels[status] ||
    "Offline";

  /*
   * Ignore Discord Custom Status
   * and show normal activities.
   */
  const activity =
    presence.activities?.find(
      (item) =>
        item.type !== 4
    );

  return (
    <div className="discord-card">

      <div className="discord-card-header">
        <span>DISCORD</span>

        <div className="discord-status">
          <span
            className={`presence-dot ${status}`}
          />

          {statusLabel}
        </div>
      </div>

      {activity ? (
        <div className="discord-activity">

          {activity.assets?.large_image && (
            <div className="discord-activity-image">
              <img
                src={
                  activity.assets.large_image
                }
                alt={
                  activity.assets
                    .large_text ||
                  ""
                }
              />
            </div>
          )}

          <div className="discord-activity-info">

            <span className="discord-activity-label">
              {activity.name}
            </span>

            {activity.details && (
              <strong>
                {activity.details}
              </strong>
            )}

            {activity.state && (
              <p>
                {activity.state}
              </p>
            )}

          </div>

        </div>
      ) : (
        <div className="discord-no-activity">
          No current activity
        </div>
      )}

    </div>
  );
}