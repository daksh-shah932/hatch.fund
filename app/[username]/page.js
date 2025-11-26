export const dynamic = "force-dynamic";
export const dynamicParams = true;

import React from "react";
import PaymentPage from "../component/PaymentPage";
import { notFound } from "next/navigation";
import connectDb from "../db/connectDb";
import User from "../models/User";

export default async function Username({ params }) {
  const { username } = params;   // FIXED – no await

  await connectDb();
  const u = await User.findOne({ username });

  if (!u) return notFound();

  return <PaymentPage username={username} />;
}

export async function generateMetadata({ params }) {
  const { username } = params;  // FIXED – no await

  return {
    title: `${username} - HatchFund`,
  };
}
