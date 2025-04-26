'use client';

import { useSession } from "next-auth/react";

export default function Profile() {
  const session = useSession();

  if (session.data?.user) {
    return <div>Signed in!</div>
  }

  return <div>Signed Out!</div>
}