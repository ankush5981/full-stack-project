import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3000/register",
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

      window.location.href = "/profile";

    } catch (error) {
      console.log(error.response.data);

      setMessage(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 font-sans">

      <form
        onSubmit={handleSubmit}
        className="w-95 bg-white p-10 rounded-2xl flex flex-col gap-4 shadow-xl border-t-[6px] border-blue-600"
      >

        <h1 className="text-center text-3xl font-bold text-gray-900">
          Create Account
        </h1>

        <p className="text-center text-sm text-gray-500 -mt-2">
          Register to continue
        </p>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-4 border border-gray-300 rounded-xl bg-gray-50 text-[15px] outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition"
        />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-4 border border-gray-300 rounded-xl bg-gray-50 text-[15px] outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-4 border border-gray-300 rounded-xl bg-gray-50 text-[15px] outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-4 border border-gray-300 rounded-xl bg-gray-50 text-[15px] outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 transition"
        />

        <button
          type="submit"
          className="p-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 hover:-translate-y-px transition"
        >
          Register
        </button>

        <p className="text-center text-gray-500 text-sm">
          Already have an account?
        </p>

        <button
          type="button"
          onClick={() => {
            window.location.href = "/login";
          }}
          className="p-4 rounded-xl border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition"
        >
          Sign In
        </button>

        <h3 className="text-center text-red-600 text-sm">
          {message}
        </h3>

      </form>

    </div>
  );
}