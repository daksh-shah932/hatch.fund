"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchuser, updateProfile } from "../actions/useractions";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({});

  useEffect(() => {
    document.title = "Dashboard - HatchFund";
    if (!session) return;
    getdata();
  }, [session]);
  ;

  useEffect(() => {
    if (session === null) router.push("/login");
  }, [session]);

  const getdata = async () => {
    const u = await fetchuser(session.user.username);
    setForm(u || {});
    // console.log("Loaded user:", u);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    // console.log("FORM BEFORE SUBMIT:", form);
    let a = await updateProfile(form, session.user.username);
    toast.success('Profile updated successfully!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
      <div>
        <h1 className="text-2xl font-bold text-center pt-10">
          Welcome to my Dashboard
        </h1>

        {!session ? (
          <p className="text-center mt-10">Loading...</p>
        ) : (
          <form action={handleSubmit}>
            <div className="inputs flex flex-col gap-4 w-[50%] m-auto mt-10">

              {/* Name */}
              <div className="flex flex-col">
                <label>Name</label>
                <input
                  name="name"
                  value={form.name || ""}
                  onChange={handleChange}
                  className="bg-slate-800 rounded-md w-full p-2 mt-1"
                  type="text"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label>Email</label>
                <input
                  name="email"
                  value={form.email || ""}
                  onChange={handleChange}
                  className="bg-slate-800 rounded-md w-full p-2 mt-1"
                  type="email"
                />
              </div>

              {/* Username */}
              <div className="flex flex-col">
                <label>Username</label>
                <input
                  name="username"
                  value={form.username || ""}
                  onChange={handleChange}
                  className="bg-slate-800 rounded-md w-full p-2 mt-1"
                  type="text"
                />
              </div>

              {/* Profile Picture URL */}
              <div className="flex flex-col">
                <label>Profile Picture URL</label>
                <input
                  name="profilepic"
                  value={form.profilepic || ""}
                  onChange={handleChange}
                  className="bg-slate-800 rounded-md w-full p-2 mt-1"
                  type="url"
                />
              </div>

              {/* Cover Picture URL */}
              <div className="flex flex-col">
                <label>Cover Picture URL</label>
                <input
                  name="coverpic"
                  value={form.coverpic || ""}
                  onChange={handleChange}
                  className="bg-slate-800 rounded-md w-full p-2 mt-1"
                  type="url"
                />
              </div>

              {/* Razorpay ID */}
              <div className="flex flex-col">
                <label>Razorpay ID</label>
                <input
                  name="razorpayId"
                  value={form.razorpayId || ""}
                  onChange={handleChange}
                  className="bg-slate-800 rounded-md w-full p-2 mt-1"
                  type="text"
                />
              </div>

              {/* Razorpay Secret */}
              <div className="flex flex-col">
                <label>Razorpay Secret</label>
                <input
                  name="razorpaySecret"
                  value={form.razorpaySecret || ""}
                  onChange={handleChange}
                  className="bg-slate-800 rounded-md w-full p-2 mt-1"
                  type="password"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-500 w-full p-1 cursor-pointer hover:bg-blue-600 rounded-lg"
              >
                Save
              </button>

            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default Dashboard;


