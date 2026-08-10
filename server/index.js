const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
// const csrf = require("@dr.pogodin/csurf");
const cookieParser = require("cookie-parser");
const PORT = 8000;
require("dotenv").config();
const jwt = require("jsonwebtoken");
const authenticateToken = require("./middlewares/authMiddleware");
const {
  registerValidation,
  validate,
} = require("./middlewares/registerValidation");
const {
  studentValidation,
  studentValidate,
} = require("./middlewares/studentInputValidation");
const {
  passwordValidation,
  passwordValidate,
} = require("./middlewares/resetPasswordValidation");
const bcrypt = require("bcrypt");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
const sendResetEmail = require("./utils/sendEmail");
const sendInviteEmail = require("./utils/sendInviteEmail");
const app = express();

const loginLimiter = rateLimit({
  windowMs: 15 * 1000, // 15 minutes
  max: 5, //this is the number of attempts alowed for the user does not matter if pass is correct ornot
  standardHeaders: true,
  message: {
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
});
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

app.use(express.json());
app.use(cookieParser());

// const csrfProtection = csrf({
//   cookie: {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//   },
// });

// app.use(csrfProtection);

// app.get("/api/csrf-token", (req, res) => {
//   res.json({ csrfToken: req.csrfToken() }); // req.csrfToken is making a string
// });

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
//this was before diskstorage used only was specifying where the destination folder is
// const upload = multer({
//   dest:"uploads/"
// })

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads')
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.random()
//     return cb(null , uniqueSuffix + "-" + file.originalname)
//   }
// })
const storage = multer.memoryStorage();

const upload = multer({ storage });

/* =========================================================
   GET ROUTES
   ========================================================= */

app.get("/students", authenticateToken, async (req, res) => {
  const search = req.query.search || "";
  const selectedCourse = req.query.course || "";
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  const term = `%${search}%`; // what is this for like getting the exact

  let sql = `
    SELECT *
    FROM students
    WHERE (name LIKE ? OR email LIKE ?)`;

  const params = [term, term];

  if (selectedCourse) {
    sql = sql + `AND course = ?`;
    params.push(selectedCourse);
  }

  sql = sql + `LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  try {
    const [results] = await db.promise().query(sql, params);
    res.json(results);
  } catch (error) {
    res.json({ messsage: "there was an error getting your search" });
  }
});

app.get("/students/:id/images", (req, res) => {
  db.query(
    `SELECT student_image
     FROM students
     WHERE id = ?`,
    [req.params.id],
    (err, results) => {
      if (results.length === 0) {
        return res.send(404).json({
          message: "no image has been uploaded",
        });
      }

      res.set("Content-Type", "image/jpeg");

      res.send(results[0].student_image);
    },
  );
});

app.get("/invite-user", async (req, res) => {
  const userId = req.query.id;
  try {
    const [rows] = await db
      .promise()
      .query(
        "SELECT *  from invitedUsers where id = ? ORDER BY ID DESC LIMIT 1",
        [userId],
      );
    // console.log(rows, "these are the rows")
    res.json({ userRole: rows[0].userRole, email: rows[0].email });
  } catch (error) {
    res.status(500).json({ message: "did not get user email" });
  }
});

/* =========================================================
   POST ROUTES
   ========================================================= */

// app.post("/students", studentValidation, studentValidate, async (req, res) => {
//   const { name, email, course } = req.body;
//      const [results] = await db.promise().query(
//     "SELECT * FROM STUDENTS email = ?" , [email]
//   )

//   if(email){
//     res.status(400).json({message:"This email already exists"})
//     return;
//   }
//   try{
//       const [results] =   await db.promise().query(
//     "INSERT INTO students (name, course, email) VALUES (?, ?, ?)",
//     [name, course, email])
//      res.json({ message: "Student added", id: results.insertId });
//   }catch(error) {
//      return res.status(500).json({ error: error.message });
//   }
// }
// )
app.post("/students", studentValidation, studentValidate, async (req, res) => {
  const { name, email, course } = req.body;

  try {
    const [results] = await db
      .promise()
      .query("SELECT * FROM students WHERE email = ?", [email]);

    if (results.length > 0) {
      return res.status(400).json({ message: "This email already exists" });
    }

    const [insertResult] = await db
      .promise()
      .query("INSERT INTO students (name, course, email) VALUES (?, ?, ?)", [
        name,
        course,
        email,
      ]);

    return res.json({ message: "Student added", id: insertResult.insertId });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/auth/register", registerValidation, validate, async (req, res) => {
  const { name, email, password, userRoleData } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length > 1) {
        return res.status(400).json({
          message: "User already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO users (name, email, password, user_role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, userRoleData],
        (err) => {
          if (err)
            return res.status(500).json({
              error: err.message,
            });

          res.json({
            message: "Registered successfully",
          });
        },
      );
    },
  );
});

app.post("/auth/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  try {
    const [results] = await db
      .promise()
      .query("Select * from users where email = ?", [email]);
    if (results.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = results[0];
    console.log(user.lock_until, "this is the value for lock until")
    if (user.lock_until && new Date(user.lock_until) > new Date()) {
      console.log(user.lock_until && new Date(user.lock_until) > new Date() , "this is for if locked")
      return res.status(403).json({
        message: "Account locked. please try again later.",
      });
    }else if (user.lock_until && new Date(user.lock_until) <= new Date()) {
      console.log(user.lock_until && new Date(user.lock_until) <= new Date(), "this is for time has passed")
      await db.promise().query("Update users set failed_attempts = 0 , lock_until = NUll where email = ?" , [email])
      console.log("time has passed rest back to 0")
      // console.log(user)
         user.failed_attempts = 0; 
    }

    const passwordMatch = await bcrypt.compare(password, results[0].password);
    console.log(passwordMatch, "this is for the passowrd matches or not");
    if (!passwordMatch) {
      const failedAttempts = user.failed_attempts + 1;
      if (failedAttempts >= 4) {
        const lockUntil = new Date(Date.now() + 15 * 60 * 1000);
        const [rows] = await db
          .promise()
          .query(
            "Update users set failed_attempts = ? ,lock_until = ? where email = ?",
            [failedAttempts, lockUntil, email],
          );
          console.log(rows , 'this is the value that even if wrong no update')
        return res.status(403).json({
          message: "Too many failed attempts. Account locked for 15 minutes.",
        });
      }
      const [rows] = await db.promise().query("Update users set failed_attempts = ? where email = ?", [failedAttempts, email])
      return res.status(401).json({ message: "Invalid password" });

    } 

      const token = jwt.sign(
        { email: results[0].email }, // payload what we want to seralize ig to convert? into json or the data ig that we have
        process.env.ACCESS_JWT_SECRET,
        { expiresIn: "15m" },
      );

      const refreshToken = jwt.sign(
        {
          email: results[0].email,
          user_role: results[0].user_role,
          name: results[0].name,
        },
        process.env.REFRESH_JWT_SECRET,
        { expiresIn: "40w" },
      );
      db.query(
        "UPDATE users SET refresh_token = ? WHERE email = ? ",
        [refreshToken, email],
        (err) => {
          if (err) {
            return res.status(500).json({
              message: "There was an error adding the refresh token",
            });
          }
        },
      );
      res.cookie("refreshToken", refreshToken, {
        // these are all the propties i want to set for the cookie
        httpOnly: true,
        secure: false, // use of secure
        sameSite: "strict",
      });

      const userInfo = {
        name: user.name,
        email: user.email,
        user_role: user.user_role,
      };
      res.json({
        message: "Login successful",
        token: token,
        user_info: userInfo,
        password: password,
      });
    
  } catch (error) {
    res
      .status(500)
      .json({ message: "The password or username you have written is wrong" });
  }
});

app.post("/auth/logout", (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    db.query("UPDATE  users SET refresh_token = NULL WHERE refresh_token = ?", [
      refreshToken,
    ]);

    res.clearCookie("refreshToken");
    res.json({
      message: "logged out",
    });
  } catch (err) {
    res.sendStatus(500);
  }
});

app.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken; // it is req.cookies in the header

  if (!refreshToken) {
    return res.status(405).json({
      message: "there is no refresh token",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
    db.query(
      "SELECT * from users WHERE email = ?",
      [decoded.email],
      (err, results) => {
        if (err) {
          res.status(500).json({
            message: "There was a server error",
          });
        }
        if (results[0].refresh_token !== refreshToken) {
          return res.status(403).json({
            message: "Refresh token does not match",
          });
        }
        const accessToken = jwt.sign(
          // we have it within the callback only when it is completed then we will create the access token
          { email: decoded.email },
          process.env.ACCESS_JWT_SECRET,
          { expiresIn: "15m" },
        );
        const userRoleValueFromDecoded = decoded.user_role;
        const userNameFromDecoded = decoded.name;
        res.json({
          userRoleValueFromDecoded,
          accessToken,
          userNameFromDecoded,
          message:
            "The refresh token has been verified and a new access token created",
        });
      },
    );
  } catch (err) {
    res.status(403).json({ message: "could not create new access token" });
  }
});

app.post("/invite-user", async (req, res) => {
  const email = req.body.email;
  const userRole = req.body.userRole; // i have the value i need to show
  console.log(email);
  console.log(userRole, "this should be the user role that has been selected");

  try {
    const [rows] = await db
      .promise()
      .query("INSERT into invitedUsers (email, userRole) VALUES(?, ?)", [
        email,
        userRole,
      ]);

    const invitedUserId = rows.insertId;
    const invitationLink = `http://localhost:3000/invite-user-register?id=${invitedUserId}`;
    await sendInviteEmail(email, invitationLink);

    res.json({
      message:
        "If that email is registered, a reset link has been sent.successfull",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

app.post("/auth/forgetPassword", async (req, res) => {
  const email = req.body.email;

  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.json({ message: "no such suer existsss" });
    }

    const resetLink = `http://localhost:3000/reset-password?email=${email}`;
    await sendResetEmail(email, resetLink);

    res.json({
      message: "If that email is registered, a reset link has been sent.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

app.post(
  "/auth/reset-password",
  passwordValidation,
  passwordValidate,
  async (req, res) => {
    const email = req.body.email;
    const newPassword = req.body.newPassword;

    try {
      const [rows] = await db
        .promise()
        .query("SELECT * FROM users WHERE email = ?", [email]);

      if (rows.length === 0) {
        return res.status(400).json({ message: "Invalid request." });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await db
        .promise()
        .query("UPDATE users SET password = ? WHERE email = ?", [
          hashedPassword,
          email,
        ]);

      res.json({ message: "Password reset successful. Please log in." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong." });
    }
  },
);

/* =========================================================
   PUT ROUTES
   ========================================================= */

// app.put("/upload" , upload.single("image"),(req,res) => {
//   const imageBuffer = req.file ? req.file.buffer : null

app.put("/students/:id", studentValidation, studentValidate, (req, res) => {
  const studentId = req.params.id;
  const { name, email, course } = req.body;
  db.query(
    "UPDATE students SET name = ?, email = ?, course = ? WHERE id = ?",
    [name, email, course, studentId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Student updated successfully", id: studentId });
    },
  );
});

app.put("/students/:id/image", upload.single("image"), (req, res) => {
  const studentId = req.params.id;
  const imageBuffer = req.file ? req.file.buffer : null;
  console.log(req.params.id);

  db.query(
    `UPDATE students
       SET student_image = ?
       WHERE id = ?`,
    [imageBuffer, studentId],
    (err) => {
      if (err) {
        return res.status(500).json({
          error: "there has been an error",
        });
      }

      res.json({
        message: "Image updated",
      });
    },
  );
});

/* =========================================================
   DELETE ROUTES
   ========================================================= */

app.delete("/students/:id", (req, res) => {
  db.query(
    "DELETE FROM students WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Student has been deleted successfully" });
    },
  );
});

/* =========================================================
   SERVER STARTUP
   ========================================================= */

db.connect((err) => {
  if (err) {
    console.log("DB connection failed:", err);
    return;
  }
  console.log("MySQL connected");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
