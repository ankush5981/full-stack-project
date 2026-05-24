function IsloggedIn(req, res, next) {

  try {

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Login required",
      });
    }

    const token =
      authHeader.split(" ")[1];

    const data = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = data;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid token",
    });
  }
}