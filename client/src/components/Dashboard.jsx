posts.map((post) => (

  <div
    key={post._id}
    className="bg-[#111111] rounded-3xl overflow-hidden border border-gray-800 hover:border-gray-600 transition duration-300"
  >

    {/* TOP */}
    <div className="p-5 flex items-center gap-4 border-b border-gray-800">

      {/* PROFILE */}
      <img
        src={
          post.user?.profilePic
            ? `https://full-stack-project-1-mx06.onrender.com/uploads/${post.user.profilePic}`
            : "https://via.placeholder.com/150"
        }
        alt="profile"
        className="w-14 h-14 rounded-full object-cover border-2 border-gray-700"
      />

      {/* USER INFO */}
      <div>

        <h2 className="font-bold text-lg text-white">
          {post.user?.name || "Unknown User"}
        </h2>

        <p className="text-sm text-gray-400">
          @{post.user?.username || "unknown"}
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
        {new Date(post.createdAt).toLocaleString()}
      </small>

      <button
        className="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-xl text-gray-400 text-sm font-semibold hover:bg-[#1a1a1a] hover:text-white transition"
      >
        👍 Like
      </button>

    </div>

  </div>
))