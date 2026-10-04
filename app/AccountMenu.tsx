"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

type AccountMenuProps = {
  name?: string | null;
  image?: string | null;
};

export default function AccountMenu({
  name,
  image,
}: AccountMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="account-menu">
      <button
        type="button"
        className="account-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <div className="account-avatar">
          {image ? (
            <img
              src={image}
              alt=""
            />
          ) : (
            <span>
              {(name || "R")
                .charAt(0)
                .toUpperCase()}
            </span>
          )}
        </div>

        <span className="account-name">
          {name || "Reale Member"}
        </span>

        <span className="account-arrow">
          {open ? "⌃" : "⌄"}
        </span>
      </button>

      {open && (
        <div className="account-dropdown">
          <a href="/edit">
            Edit Profile
          </a>

          <button
            type="button"
            onClick={() =>
              signOut({
                callbackUrl: "/",
              })
            }
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}