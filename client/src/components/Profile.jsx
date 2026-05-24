import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] =
    useState(null);

  const [content, setContent] =
    useState("");

  // FETCH PROFILE
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "https://full-stack-project-1-mx06.onrender.com/profile",
        {
          withCredentials: true,
        }
      );

      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // CREATE POST
  const createPost = async () => {
    if (!content.trim()) return;

    try {
      await axios.post(
        "https://full-stack-project-1-mx06.onrender.com/post",
        { content },
        {
          withCredentials: true,
        }
      );

      setContent("");

      fetchProfile();
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE POST
  const deletePost = async (id) => {
    try {
      await axios.delete(
        `https://full-stack-project-1-mx06.onrender.com/post/${id}`,
        {
          withCredentials: true,
        }
      );

      fetchProfile();
    } catch (error) {
      console.log(error);
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await axios.get(
        "https://full-stack-project-1-mx06.onrender.com/logout",
        {
          withCredentials: true,
        }
      );

      window.location.href =
        "/login";
    } catch (error) {
      console.log(error);
    }
  };

  // LOADING
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">

        <h1 className="text-3xl font-bold text-white">
          Loading...
        </h1>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* NAVBAR */}
      <div className="sticky top-0 z-50 bg-[#111111] border-b border-gray-800">

        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <button
            onClick={() => {
              window.location.href =
                "/dashboard"
            }}
            className="px-5 py-2 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            Back
          </button>

          <h1 className="text-3xl font-bold">
            Profile
          </h1>

          <button
            onClick={logout}
            className="px-5 py-2 bg-red-500 hover:bg-red-600 rounded-2xl font-semibold transition"
          >
            Logout
          </button>



        </div>

      </div>

      {/* MAIN */}
      <div className="max-w-3xl mx-auto py-10 px-5">

        {/* PROFILE CARD */}
        <div className="bg-[#111111] border border-gray-800 rounded-3xl p-8 mb-8">

          <div className="flex items-center gap-5">


            {/* PROFILE IMAGE */}
            <img
              src={`https://full-stack-project-1-mx06.onrender.com/uploads/${user.profilePic}`}
              alt=""
              onClick={() => {
                window.location.href =
                  "/edit";
              }}
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-700 cursor-pointer hover:scale-105 transition duration-300"
            />

            {/* USER INFO */}
            <div>

              <h1 className="text-3xl font-bold">
                {user.name}
              </h1>

              <p className="text-gray-400 mt-1">
                @{user.username}
              </p>

              <div className="flex gap-6 mt-4 text-sm text-gray-400">

                <p>
                  <span className="text-white font-bold">
                    {user.posts.length}
                  </span>{" "}
                  Posts
                </p>



              </div>

            </div>

          </div>

        </div>

        {/* CREATE POST */}
        <div className="bg-[#111111] border border-gray-800 rounded-3xl p-6 mb-8">

          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            className="w-full h-28 bg-black border border-gray-700 rounded-2xl p-4 text-white outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
          />

          <div className="flex justify-end mt-4">

            <button
              onClick={createPost}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-2xl font-semibold transition"
            >
              Create Post
            </button>

          </div>

        </div>

        {/* POSTS */}
        <div className="space-y-6">

          {user.posts.length === 0 ? (
            <div className="bg-[#111111] border border-gray-800 rounded-3xl p-10 text-center text-gray-400">

              No posts yet

            </div>
          ) : (
            user.posts.map((p) => (
              <div
                key={p._id}
                className="bg-[#111111] border border-gray-800 rounded-3xl overflow-hidden"
              >

                {/* POST TOP */}
                <div className="p-5 flex items-center justify-between border-b border-gray-800">

                  <div className="flex items-center gap-4">

                    <img
                      src={`/images/uploads/${user.profilePic}`}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover border border-gray-700"
                    />

                    <div>

                      <h2 className="font-bold">
                        {user.name}
                      </h2>

                      <p className="text-sm text-gray-400">
                        @{user.username}
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={() =>
                      deletePost(p._id)
                    }
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-semibold transition"
                  >
                    Delete
                  </button>

                </div>


                {/* CONTENT */}
                <div className="p-5">

                  <p className="text-gray-300 leading-7">
                    {p.content}
                  </p>

                </div>

                {/* FOOTER */}
                <div className="px-5 py-4 border-t border-gray-800 flex items-center justify-between bg-black">

                  <small className="text-gray-500 text-xs">
                    {new Date(
                      p.createdAt
                    ).toLocaleString()}
                  </small>

                  <div className="flex items-center gap-3">

                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-xl text-gray-400 text-sm hover:bg-[#1a1a1a] hover:text-white transition">
                      👍 Like
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-xl text-gray-400 text-sm hover:bg-[#1a1a1a] hover:text-white transition">
                      💬 Comment
                    </button>

                  </div>

                </div>

              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}