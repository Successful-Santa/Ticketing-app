const { db } = require("../utils/util");

function authMiddleware(req, res, next) {
  // get auth token from headers
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.json({
      message: "Auth token not provided.",
    });
  }

  db.all(
    "SELECT token, user_id FROM LoginTokens WHERE token = ?",
    [authToken],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      if (rows.length === 0) {
        return res.status(400).json({
          message: "Invalid auth token.",
        });
      }

      // set user_id in req
      const userId = rows[0]["user_id"];
      req.userId = userId;

      next();
    }
  );
}

module.exports = authMiddleware;
