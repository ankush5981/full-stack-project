import { useState } from "react";
import axios from "axios";

export default function EditProfilePic() {
  const [image, setImage] =
    useState(null);

  const uploadProfilePic = async () => {
    if (!image) return;

    const formData = new FormData();

    formData.append(
      "profilePic",
      image
    );

    try {
      await axios.post(
        "https://full-stack-project-1-mx06.onrender.com/upload-profile-pic",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert(
        "Profile picture updated"
      );

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-5">

      {/* CARD */}
      <div className="w-full max-w-md bg-[#111111] border border-gray-800 rounded-3xl shadow-2xl p-8">

        {/* HEADING */}
        <div className="text-center mb-8">

          <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            📷
          </div>

          <h1 className="text-3xl font-bold text-white mt-5">
            Update Profile
          </h1>

          <p className="text-gray-400 mt-2">
            Upload your new profile photo
          </p>

        </div>

        {/* PREVIEW */}
        <div className="flex justify-center mb-6">

          {image ? (
            <img
              src={URL.createObjectURL(
                image
              )}
              alt=""
              className="w-36 h-36 rounded-full object-cover border-4 border-blue-500 shadow-lg"
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-black border border-gray-700 flex items-center justify-center text-gray-500 text-sm">
              No Image
            </div>
          )}

        </div>

        {/* FILE INPUT */}
        <div className="mb-6">

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(
                e.target.files[0]
              )
            }
            className="block w-full text-sm text-gray-400
            file:mr-4 file:py-3 file:px-5
            file:rounded-2xl file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-600 file:text-white
            hover:file:bg-blue-700
            file:cursor-pointer cursor-pointer"
          />

        </div>

        {/* BUTTON */}
        <button
          onClick={uploadProfilePic}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold transition duration-300 shadow-lg"
        >
          Upload Profile Picture
        </button>

      </div>

    </div>
  );
}