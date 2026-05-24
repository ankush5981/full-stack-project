require("dotenv").config({ path: "./.env" });

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const userModel = require("./models/user");
const postModel = require("./models/post");

const app = express();

// MIDDLEWARES
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use(
  cors({
    origin: ["http://localhost:5173", "https://ankush-social-app.onrender.com"],
  }),
);

// MULTER
const storage = new CloudinaryStorage({
  cloudinary,

  params: {
    folder: "profile_pics",

    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({
  storage,
});

// REGISTER
app.post("/register", async (req, res) => {
  const { name, username, email, password } = req.body;

  let existingUser = await userModel.findOne({
    email,
  });

  if (existingUser) {
    return res.status(400).json({
      message: "User already registered",
    });
  }

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(
      password,
      salt,

      async (err, hash) => {
        let user = await userModel.create({
          name,
          username,
          email,
          password: hash,
        });

        let token = jwt.sign(
          {
            email: user.email,

            userid: user._id,
          },

          process.env.JWT_SECRET,
        );

        res.json({
          message: "Registered successfully",

          token,
        });
      },
    );
  });
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let user = await userModel.findOne({
    email,
  });

  if (!user) {
    return res.status(400).json({
      message: "User not Registered",
    });
  }

  bcrypt.compare(
    password,
    user.password,

    (err, result) => {
      if (result) {
        let token = jwt.sign(
          {
            email: user.email,

            userid: user._id,
          },

          process.env.JWT_SECRET,
        );

        res.json({
          message: "Login successful",

          token,
        });
      } else {
        res.status(400).json({
          message: "Wrong password",
        });
      }
    },
  );
});

// PROFILE
app.get(
  "/profile",
  IsloggedIn,

  async (req, res) => {
    let user = await userModel
      .findOne({
        email: req.user.email,
      })
      .populate("posts");

    res.json(user);
  },
);

// CREATE POST
app.post(
  "/post",
  IsloggedIn,

  async (req, res) => {
    let user = await userModel.findOne({
      email: req.user.email,
    });

    let post = await postModel.create({
      user: user._id,
      content: req.body.content,
    });

    user.posts.push(post._id);

    await user.save();

    res.json({
      message: "Post created",
    });
  },
);

// DELETE POST
app.delete(
  "/post/:id",
  IsloggedIn,

  async (req, res) => {
    await postModel.findByIdAndDelete(req.params.id);

    res.json({
      message: "Post deleted",
    });
  },
);

// ALL POSTS
app.get(
  "/allposts",
  IsloggedIn,

  async (req, res) => {
    try {
      const posts = await postModel
        .find()
        .populate("user", "name username profilePic")
        .sort({
          createdAt: -1,
        });

      res.json(posts);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching posts",
      });
    }
  },
);

// UPLOAD PROFILE PIC
app.post(
  "/upload-profile-pic",
  IsloggedIn,
  upload.single("profilePic"),

  async (req, res) => {
    try {
      console.log(req.file);

      let user = await userModel.findOne({
        email: req.user.email,
      });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      user.profilePic = req.file.secure_url;

      await user.save();

      res.json({
        message: "Profile picture uploaded",
        image: req.file.secure_url,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Upload failed",
        error: error.message,
      });
    }
  },
);

// JWT MIDDLEWARE
function IsloggedIn(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Login required",
      });
    }

    const token = authHeader.split(" ")[1];

    const data = jwt.verify(token, process.env.JWT_SECRET);

    req.user = data;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

// DATABASE
mongoose
  .connect(process.env.MONGO_URL)

  .then(() => {
    console.log("MongoDB connected");

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  })

  .catch((err) => {
    console.log("MongoDB Error:", err);
  });
