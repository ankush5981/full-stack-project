import { useState } from "react";
import axios from "axios";

export default function Editprofile() {

  const [image, setImage] =
    useState(null);

  const [message, setMessage] =
    useState("");

  // TOKEN
  const token =
    localStorage.getItem("token");

  // UPLOAD IMAGE
  const uploadImage = async () => {

    if (!image) {
      return setMessage(
        "Please select image"
      );
    }

    try {

      const formData =
        new FormData();

      formData.append(
        "profilePic",
        image
      );

      const res = await axios.post(
        "https://full-stack-project-1-mx06.onrender.com/upload-profile-pic",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setMessage(
        res.data.message
      );

      setTimeout(() => {

        window.location.href =
          "/profile";

      }, 1000);

    } catch (error) {

      console.log(error);

      setMessage(
        error.response?.data
          ?.message ||
        "Upload failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-5">

      {/* CARD */}
      <div className="w-full max-w-md bg-[#111111] border border-gray-800 rounded-3xl p-8 shadow-2xl">

        {/* TITLE */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-white">
            Edit Profile
          </h1>

          <p className="text-gray-400 mt-2">
            Upload profile picture
          </p>

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
            className="w-full bg-black border border-gray-700 rounded-2xl px-4 py-3 text-white"
          />

        </div>

        {/* BUTTON */}
        <button
          onClick={uploadImage}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold transition duration-300"
        >
          Upload
        </button>

        {/* MESSAGE */}
        {message && (

          <p className="text-center text-sm text-gray-300 mt-5">

            {message}

          </p>
        )}

        {/* BACK */}
        <button
          onClick={() => {
            window.location.href =
              "/profile";
          }}
          className="w-full mt-4 border border-gray-700 hover:bg-[#1a1a1a] text-white py-3 rounded-2xl font-semibold transition duration-300"
        >
          Back
        </button>

      </div>

    </div>
  );
}