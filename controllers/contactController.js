const db = require("../config/db");

const createContact = (req, res) => {
  const {
    name,

    email,

    phone,

    subject,

    message,
  } = req.body;
  if (!name || !email || !phone || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }
  const sql = `
INSERT INTO contacts
(name,email,phone,subject,message)
VALUES(?,?,?,?,?)
`;

  db.query(
    sql,

    [name, email, phone, subject, message],

    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          success: false,
          message: "Internal Server Error",
        });
      }

      res.status(201).json({
        success: true,

        message: "Message Saved",
      });
    },
  );
};

const getContacts = (req, res) => {
  db.query(
    "SELECT * FROM contacts ORDER BY id DESC",

    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(result);
    },
  );
};

module.exports = {
  createContact,

  getContacts,
};
