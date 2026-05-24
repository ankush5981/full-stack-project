import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [name, setName] =
    useState("");
  const [username, setUsername] =
    useState("");
  const [email, setEmail] =
    useState("");
  const [password, setPassword] =
    useState("");
  const [message, setMessage] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://full-stack-project-1-mx06.onrender.com/register",
        {
          name,
          username,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      setMessage(res.data.message);

      window.location.href =
        "/profile";
    } catch (error) {
      console.log(error.response.data);

      setMessage(
        error.response.data.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-5">

      {/* REGISTER CARD */}
      <div className="w-full max-w-md bg-[#111111] border border-gray-800 rounded-3xl shadow-2xl p-8">

        {/* LOGO */}
        <div className="text-center mb-8">



          <h1 className="text-4xl font-bold text-white mt-5">
            SocialApp
          </h1>

          <p className="text-gray-400 mt-2">
            Create your account
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >

          {/* NAME */}
          <div>

            <label className="text-sm text-gray-300 block mb-2">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full bg-black border border-gray-700 rounded-2xl px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            />

          </div>

          {/* USERNAME */}
          <div>

            <label className="text-sm text-gray-300 block mb-2">
              Username
            </label>

            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }
              className="w-full bg-black border border-gray-700 rounded-2xl px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            />

          </div>

          {/* EMAIL */}
          <div>

            <label className="text-sm text-gray-300 block mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full bg-black border border-gray-700 rounded-2xl px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            />

          </div>

          {/* PASSWORD */}
          <div>

            <label className="text-sm text-gray-300 block mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="w-full bg-black border border-gray-700 rounded-2xl px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            />

          </div>

          {/* MESSAGE */}
          {message && (
            <p className="text-center text-red-500 text-sm">
              {message}
            </p>
          )}

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold transition duration-300 shadow-lg"
          >
            Create Account
          </button>

        </form>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 my-6">

          <div className="flex-1 h-[1px] bg-gray-800"></div>

          <span className="text-gray-500 text-sm">
            OR
          </span>

          <div className="flex-1 h-[1px] bg-gray-800"></div>

        </div>

        {/* LOGIN */}
        <div className="text-center">

          <p className="text-gray-400 text-sm mb-4">
            Already have an account?
          </p>

          <button
            type="button"
            onClick={() => {
              window.location.href =
                "/login";
            }}
            className="w-full border border-gray-700 text-white hover:bg-gray-900 py-3 rounded-2xl font-semibold transition duration-300"
          >
            Sign In
          </button>

        </div>

      </div>

    </div>
  );
}