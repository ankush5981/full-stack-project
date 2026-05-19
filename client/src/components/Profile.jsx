import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [content, setContent] = useState("");

  // Fetch Profile
  useEffect(() => {
    fetchProfile();
  }, []);

  // Fetch User Data
  const fetchProfile = async () => {
    const res = await axios.get(
      "http://localhost:3000/profile",
      {
        withCredentials: true,
      }
    );

    setUser(res.data);
  };

  // Create Post
  const createPost = async () => {
    if (!content.trim()) return;

    await axios.post(
      "http://localhost:3000/post",
      { content },
      {
        withCredentials: true,
      }
    );

    setContent("");

    fetchProfile();
  };

  // Delete Post
  const deletePost = async (id) => {
    await axios.delete(
      `http://localhost:3000/post/${id}`,
      {
        withCredentials: true,
      }
    );

    fetchProfile();
  };

  // Logout
  const logout = async () => {
    await axios.get(
      "http://localhost:3000/logout",
      {
        withCredentials: true,
      }
    );

    window.location.href = "/";
  };

  // Loading
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold text-blue-600">
          Loading...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5 flex justify-center">

      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">

          <div className="flex items-center gap-4">

            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>

            {/* User Details */}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {user.name}
              </h1>

              <p className="text-sm text-gray-500">
                @{user.username}
              </p>
            </div>

          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition"
          >
            Logout
          </button>

        </div>

        {/* Create Post */}
        <div className="mb-8">

          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            className="w-full h-20 border border-gray-300 rounded-lg p-4 text-sm outline-none resize-none focus:border-blue-600"
          />

          <div className="flex justify-end mt-4">

            <button
              onClick={createPost}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              Create Post
            </button>

          </div>

        </div>

        {/* Posts Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-5">
          Your Posts
        </h2>

        {/* Posts */}
        <div className="flex flex-col gap-4">

          {user.posts.length === 0 ? (
            <p className="text-center text-gray-500 py-5">
              No posts yet
            </p>
          ) : (
            user.posts.map((p) => (
              <div
                key={p._id}
                className="flex items-center justify-between gap-5 p-4 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-sm transition"
              >

                <p className="text-gray-700 text-sm leading-6 flex-1 wrap-break-word">
                  {p.content}
                </p>

                <button
                  onClick={() =>
                    deletePost(p._id)
                  }
                  className="px-4 py-2 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition"
                >
                  Delete
                </button>

              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}