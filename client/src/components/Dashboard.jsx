import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/allposts",
        {
          withCredentials: true,
        }
      );

      setPosts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* NAVBAR */}
      <div className="sticky top-0 z-50 bg-[#0f0f0f] border-b border-gray-800">

        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">

          <h1 className="text-3xl font-bold text-white">
            SocialApp
          </h1>

          <button
            onClick={() => {
              window.location.href =
                "/profile";
            }}
            className="px-5 py-2 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            Profile
          </button>


        </div>

      </div>

      {/* MAIN */}
      <div className="max-w-6xl mx-auto py-10 px-5">

        {/* TITLE */}
        <div className="text-center mb-10">

          <h1 className="text-4xl font-bold">
            All User Posts
          </h1>

          <p className="text-gray-400 mt-3">
            Explore posts shared by users
          </p>

        </div>

        {/* POSTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {posts.length === 0 ? (
            <div className="col-span-full bg-[#111111] rounded-3xl p-10 text-center text-gray-400 border border-gray-800">
              No posts available
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-[#111111] rounded-3xl overflow-hidden border border-gray-800 hover:border-gray-600 transition duration-300"
              >

                {/* TOP */}
                <div className="p-5 flex items-center gap-4 border-b border-gray-800">

                  {/* PROFILE */}
                  <img
                    src={`/images/uploads/${post.user.profilePic}`}
                    alt=""
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-700"
                  />

                  {/* USER INFO */}
                  <div>

                    <h2 className="font-bold text-lg text-white">
                      {post.user.name}
                    </h2>

                    <p className="text-sm text-gray-400">
                      @{post.user.username}
                    </p>

                  </div>

                </div>



                {/* CONTENT */}
                <div className="p-5">

                  <p className="text-gray-300 leading-7 text-[15px]">
                    {post.content}
                  </p>

                </div>

                {/* FOOTER */}
                <div className="px-5 py-4 border-t border-gray-800 flex items-center justify-between bg-black">

                  <small className="text-gray-500 text-xs">
                    {new Date(
                      post.createdAt
                    ).toLocaleString()}
                  </small>

                  {/* LIKE BUTTON */}
                  <button
                    className="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-xl text-gray-400 text-sm font-semibold hover:bg-[#1a1a1a] hover:text-white transition"
                  >
                    👍 Like
                  </button>

                </div>

              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}