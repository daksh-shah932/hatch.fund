import React from "react";
import PaymentPage from "../component/PaymentPage";
import { notFound } from "next/navigation";
import connectDb from "../db/connectDb";
import User from "../models/User";
import { connect } from "mongoose";

const Username = async ({ params }) => {
  //if username is not found show 404 page
  const checkuser=async ()=>{
  connectDb();
 let u=await User.findOne({username:params.username});
  if (!u) {
    return notFound();
  } 
}
 await checkuser();
 return <PaymentPage await username={params.username} />;
};

export default Username;

export async function generateMetadata({ params }) {
  // Fetch data based on the username parameter
  return{
    title: `${params.username} - HatchFund`,
  }
}