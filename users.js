const express = require("express");
const { db, GenerateRandomToken } = require("../utils/util");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const saltRounds = 10;

// register user
router.post("/register", async (req, res) => {
  // get email, fullname, age, phone, password, confirm_password from user
  const uniqueId = uuidv4();
  let email = req.body?.email;
  let fullname = req.body?.fullname;
  let age = req.body?.age;
  let phone = req.body?.phone;
  let password = req.body?.password;
  let confirm_password = req.body?.confirm_password;

  // send error message if invalid input
  if (!email) {
    return res.status(400).json({
      message: "Email is required.",
    });
  }

  if (!fullname) {
    return res.status(400).json({
      message: "Fullname is required.",
    });
  }

  if (!phone) {
    return res.status(400).json({
      message: "Phone is required.",
    });
  }

  if (!password) {
    return res.status(400).json({
      message: "Password is required.",
    });
  }

  if (!confirm_password) {
    return res.status(400).json({
      message: "Confirm password is required.",
    });
  }

  // check if password and confirm password match
  if (password !== confirm_password) {
    return res.status(400).json({
      message: "Password and confirm password do not match.",
    });
  }

  if (!age) {
    age = null;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  db.all("SELECT email FROM Users WHERE email = ?", [email], (err, rows) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    if (rows.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Proceed with the rest of your logic here if no error and email does not exist
    try {
      const query = `INSERT INTO users (id, email, fullname, age, phone, password) VALUES (?, ?, ?, ?, ?, ?)`;
      db.run(
        query,
        [uniqueId, email, fullname, age, phone, hashedPassword],
        function (err) {
          if (err) {
            return res.status(500).json({
              message: "Error registering user",
              error: err.message,
            });
          }
          res.status(201).json({
            message: "User registered successfully!",
            userId: uniqueId,
          });
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "Error registering user.",
        error: error,
      });
    }
  });
});

// user login
router.post("/login", async (req, res) => {
  // get email, password from the user req
  let email = req.body.email;
  let password = req.body.password;
  // hash the req password
  console.log("Password: ", password);
  // db record for the email & password
  db.all("SELECT * FROM Users WHERE email = ?", [email], async (err, rows) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    // if doesn't exists then return invaild error
    if (rows.length === 0) {
      return res.status(400).json({
        message: "Invalid Email",
      });
    }

    const userId = rows[0].id;
    console.log("User ID:", userId);
    const hashedUserPassword = rows[0].password;
    const isMatch = await bcrypt.compare(password, hashedUserPassword);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    // generate a login token
    let token = GenerateRandomToken(20);
    // before saving the token invalidate all the existing tokens
    db.run("DELETE FROM LoginTokens WHERE user_id = ?", [userId], (err) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      // save the token in the db (LoginTokens) table with 2 days expiry
      const twoDaysFromNowInSeconds = Math.floor(
        (Date.now() + 2 * 24 * 60 * 60 * 1000) / 1000
      );
      console.log(twoDaysFromNowInSeconds);
      const tokenId = uuidv4();
      db.run(
        "INSERT INTO LoginTokens (id, user_id, token, active, expiry_date) VALUES (?, ?, ?, ?, ?)",
        [tokenId, userId, token, true, twoDaysFromNowInSeconds],
        (err, rows) => {
          if (err) {
            return res.status(500).json({
              message: err.message,
            });
          }

          return res.status(200).json({
            message: "User credentials verfied successfully.",
            token: token,
          });
        }
      );
    });
  });
});

module.exports = router;
