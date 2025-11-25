"use client";
import React, { useEffect, useState } from "react";
import Script from "next/script";
import { useSession } from "next-auth/react";
import { fetchuser, fetchpayments, initiate } from "../actions/useractions";
import { useSearchParams } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { notFound } from "next/navigation";

const PaymentPage = ({ username }) => {
  const { data: session } = useSession();
  const [paymentForm, setpaymentForm] = useState({
    name: "",
    message: "",
    amount: "",
  });
  const [curruser, setcurruser] = useState({})
  const [payments, setPayments] = useState([])
  const searchparams = useSearchParams();

  useEffect(() => {
    if (searchparams.get("paymentdone") == "true" && session) {
      toast.success('Payment Successful!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",

      });
    }

  }, [payments]);


  useEffect(() => {
    getdata();
  }, []);
  useEffect(() => {
    if (username) {
      getdata();
    }
  }, [username]);

  const handleChange = (e) => {
    setpaymentForm({ ...paymentForm, [e.target.name]: e.target.value })
  }

  const getdata = async () => {
    let u = await fetchuser(username);
    setcurruser(u);
    let dbpayments = await fetchpayments(username);
    setPayments(dbpayments);
    // console.log("Fetched payments:", dbpayments);
    // console.log("Fetched user:", u);

  }


  const pay = async (amount) => {
    // console.log("🔍session.user.name", session?.user.name);
    let a = await initiate({
      amount,
      to_username: session?.user.email.split("@")[0],
      Payment_form: paymentForm
    });
    // console.log("🧾 Initiate response:", a);
    const orderid = a?.order?.id;
    if (!orderid) {
      alert("Order creation failed. Please try again.");
      return;
    }
    // console.log("🧾 Order ID:", orderid);
    const options = {
      key: curruser.razorpayId, // Enter the Key ID generated from the Dashboard
      amount: amount * 100,
      currency: "INR",
      description: "HatchFund",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc9APxkj0xClmrU3PpMZglHQkx446nQPG6lA&s",
      order_id: orderid,

      // ❌ remove callback_url
      // callback_url: `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,

      handler: async function (response) {
        // console.log("🔔 Payment success:", response);

        const verifyRes = await fetch("/api/razorpay", {
          method: "POST",
          body: new URLSearchParams({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });

        // ✅ Parse ONLY ONCE
        const result = await verifyRes.json();
        // console.log("🔍 Verification result:", result);


        if (result?.redirectUrl) {
          window.location.href = result.redirectUrl;   // 🚀 force navigation
        }
      },

      prefill: {
        email: session?.user.email,
        contact: "+919876543210",
      },

      modal: {
        ondismiss: function () {
          // console.log("Checkout closed by user");
        },
      },
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
  };





  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"

      />
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />



      <div className="cover w-full bg-red-50 relative">
        <img className="object-cover w-full h-[350px]" src={curruser?.coverpic} alt="" />

        <div className="absolute -bottom-28 left-1/2 -translate-x-1/2 
                  border-1 border-white rounded-full h-[150px] w-[150px] overflow-hidden">
          <img
            className="object-cover h-full w-full"
            src={curruser?.profilepic}
            alt=""
          />
        </div>
      </div>


      <div className="info flex justify-center items-center flex-col mt-24 gap-2">
        <div className='mt-7 text-center font-bold text-lg'>
          @{username}
        </div>
        <div className='text-slate-400'>
          lets help {username} get an Egg!
        </div>
        <div className='text-slate-400'>
          {payments.length} Payments .  ₹{payments.reduce((a, b) => a + b.amount, 0)} raised
        </div>

        <div className="payments 
  flex flex-col lg:flex-row 
  w-full max-w-5xl 
  mx-auto 
  gap-6 
  mt-11 mb-5 px-4">

          {/* SUPPORTERS */}
          <div className="supporters 
    flex-1
    bg-slate-900 
    rounded-lg 
    p-6 lg:p-10
    max-h-[400px] 
    overflow-y-auto
    custom-scrollbar">

            <h2 className="text-2xl font-bold mb-2">Top 10 Supporters</h2>

            <ul className="space-y-4 w-full">
              {payments.length === 0 && (
                <div className="text-slate-400 mt-5">
                  No supporters yet. Be the first one to support!
                </div>
              )}

              {payments.map((p, i) => (
                <li key={i} className="flex items-start gap-2 w-full">
                  <img className="h-6 w-6" src="avatar.svg" alt="" />

                  <div className="break-words w-full">
                    <span className="font-bold">{p.name}</span> donated{" "}
                    <span className="font-bold">₹{p.amount}</span> with a message:
                    <br />
                    <span className="text-slate-300 break-words">{p.message}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* MAKE PAYMENTS */}
          <div className="makePayments 
    flex-1
    bg-slate-900 
    rounded-lg 
    p-6 lg:p-8 
    flex flex-col">

            <h2 className="text-2xl font-bold my-5">Make a Payment</h2>

            <div className="flex flex-col gap-2">
              <input
                onChange={handleChange}
                value={paymentForm.name}
                name="name"
                className="w-full p-3 rounded-lg bg-slate-800"
                type="text"
                placeholder="Enter Name"
              />

              <input
                onChange={handleChange}
                value={paymentForm.message}
                name="message"
                className="w-full p-3 rounded-lg bg-slate-800"
                type="text"
                placeholder="Enter Message"
              />

              <input
                onChange={handleChange}
                value={paymentForm.amount}
                type="number"
                name="amount"
                className="w-full p-3 rounded-lg bg-slate-800"
                placeholder="Enter Amount"
              />

              <button
                onClick={() => pay(paymentForm.amount)}
                type="button"
                disabled={
                  paymentForm.name?.length < 3 ||
                  paymentForm.message?.length < 1 ||
                  paymentForm.amount < 1
                }
                className="cursor-pointer text-white bg-gradient-to-br 
                   from-purple-600 to-blue-500 hover:bg-gradient-to-bl 
                   focus:ring-4 focus:outline-none focus:ring-blue-300 
                   font-medium rounded-lg text-sm px-5 py-2.5 
                   disabled:opacity-50 disabled:from-slate-900
                   disabled:bg-slate-600 disabled:cursor-not-allowed" 
              >
                Pay
              </button>
            </div>

            {/* PAY 10 / 20 / 30 BUTTONS — FIXED POSITION */}
            <div className="flex gap-2 mt-5 justify-center ">
              <button className="rounded-lg p-3 bg-slate-800" onClick={() => pay(10)}>Pay ₹10</button>
              <button className="rounded-lg p-3 bg-slate-800" onClick={() => pay(20)}>Pay ₹20</button>
              <button className="rounded-lg p-3 bg-slate-800" onClick={() => pay(30)}>Pay ₹30</button>
            </div>

          </div>
        </div>

      </div>
    </>
  );
};

export default PaymentPage;