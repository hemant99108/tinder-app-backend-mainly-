const express = require("express");

const { connectDB } = require("./config/database");
const User = require("./models/user");
const { validateSignupData, validateloginData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userauth}=require('./middleware/auth');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    //validate the signup data
    validateSignupData(req);
    //encrypt the password
    const { password } = req.body;
    const hashedpassword = await bcrypt.hash(password, 10);
    console.log(hashedpassword);

    const { firstName, lastName, emailId } = req.body;

    //then create the instance of the User schema and save it to the database
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedpassword,
    });
    await user.save();
    res.send("user saved successfully");
  } catch (error) {
    res.status(500).send("error in signup: " + error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    validateloginData(req);
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials ");
    }

    const validated = await bcrypt.compare(password, user.password);

    if (validated) {
      //after validation
      //create a new jwt token
      const token = await jwt.sign({ _id: user._id }, "secretkey");

      console.log(token);

      //add the token to cookie and send it back to the browser

      res.cookie("token", token);

      res.send("logged in successfully");
    } else {
      throw new Error("try another password");
    }
  } catch (error) {
    res.status(500).send("error in login api : " + error.message);
  }
});

app.get("/profile",userauth, async (req, res) => {
  try {
    const user=req.user;
    if(!user){
      throw new Error("user not found");
    }
    res.send(user);
     
  } catch (error) {
    res.status(401).send("Unauthorized  "+error.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send("error fetching user collection");
  }
});

app.get("/user", async (req, res) => {
  const useremail = req.body.email;

  try {
    const user = await User.find({ emailId: useremail });

    if (!user) {
      res.status(404).json({ message: "user not found" });
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(500).send("user with email does not exists");
  }
});

app.delete("/user", async (req, res) => {
  const { userid, email } = req.body;

  try {
    await User.findOneAndDelete(userid);
    console.log("user deletion successfully completed");
    res.send("user deleted successfully");
  } catch (error) {
    console.log("error while deletion of the user");
    res.status(500).send("user with emailId  does not exists");
  }
});

app.patch("/user/:userid", async (req, res) => {
  const userid = req.params.userid;
  const data = req.body;

  try {
    const ALLOWED = ["photoURL", "about", "gender", "age", "skills"];
    const isValidUpdate = Object.keys(data).every((field) =>
      ALLOWED.includes(field)
    );

    if (!isValidUpdate) {
      throw new Error("Invalid update fields");
    }
    if (data.skills?.length > 5) {
      throw new Error("skills array cant have more than 5 elements ");
    }

    const user = await User.findByIdAndUpdate(
      userid,
      data,
      { returnDocumnent: "before" },
      { runValidators: true }
    );
    await user.save();

    res.send(user);
    console.log("user updated successfully", user);
  } catch (error) {
    res.status(500).send("Error updating user " + error.message);
    console.log("error updating user");
  }
});

connectDB()
  .then(() => {
    console.log("datbase connection established");
    app.listen(3000, () => console.log("listening on port 3000"));
  })
  .catch((error) => {
    console.log("error  is", error);
  });
