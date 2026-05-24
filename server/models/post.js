const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    content: String,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("post", postSchema);
