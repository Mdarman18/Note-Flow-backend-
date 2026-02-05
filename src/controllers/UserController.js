// ====--------SignUp-Controllers ============--------
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NoteUser } from "../Model/User.js";
export const HandleSignUp = async (req, res) => {
  const { Email, Password, Username, Name } = req.body;
  //   console.log(`${Email} ${Password} ${Username} ${Name}`);

  if (!Email || !Password || !Username || !Name) {
    return res.status(400).json({
      message: "Please Fill the detalis",
      success: false,
    });
  }
  try {
    const existingUser = await NoteUser.findOne({
      $or: [{ Email }, { Username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email or Username already exists",
        success: false,
      });
    }
    const hashPassword = await bcrypt.hash(Password, 10);
    console.log(hashPassword);

    const user = new NoteUser({
      Password: hashPassword,
      Email,
      Username,
      Name,
    });
    await user.save();
    return res.status(200).json({
      message: "Signup successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// ====--------login routes =======-------

export const HandleLogin = async (req, res) => {
  const { Username, Email, Password } = req.body;
  if (!Email || !Password) {
    return res.status(400).json({
      message: "Please Fill the detalis",
      success: false,
    });
  }
  try {
    const existingUser = await NoteUser.findOne({
      $or: [{ Email }, { Username }],
    });

    if (!existingUser) {
      return res.status(400).json({
        message: "Email or Username does not exist",
        success: false,
      });
    }
    const isPassword = await bcrypt.compare(Password, existingUser.Password);

    if (!isPassword) {
      return res.status(401).json({
        message: "Invalid password",
        success: false,
      });
    }
    // ==-----JWT TOEKN ASSIGN -======------
    const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    const { Password: pass, ...userData } = existingUser._doc;
    //     ==----Set In Cookies =====---------
    res.cookie("authtoken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      success: true,
      user: userData,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// ===----Logoout Function ======------------
export const HandleLogout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    message: "Logout succesfully",
    success: true,
  });
};
