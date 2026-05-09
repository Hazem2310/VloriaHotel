import jwt from "jsonwebtoken";

const generateToken = (user, role = "customer") => {
  return jwt.sign(
    {
      id: user.user_id,
      role,
    },
    process.env.JWT_SECRET || "veloria-hotel-secret-key",
    {
      expiresIn: "7d",
    }
  );
};

export default generateToken;
