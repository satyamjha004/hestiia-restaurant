const db = require("../config/db");

const createReservation = (req, res) => {
  const { name, email, phone, guests, booking_date, booking_time, message } =
    req.body;
  if (!name || !email || !phone || !guests || !booking_date || !booking_time) {
    return res.status(400).json({
      success: false,
      message: "Please fill all required fields.",
    });
  }

  const sql = `
INSERT INTO reservations
(name,email,phone,guests,booking_date,booking_time,message)
VALUES(?,?,?,?,?,?,?)
`;

  db.query(
    sql,

    [name, email, phone, guests, booking_date, booking_time, message],

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

        message: "Reservation Saved",
      });
    },
  );
};

const getReservations = (req, res) => {
  db.query(
    "SELECT * FROM reservations ORDER BY id DESC",

    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(result);
    },
  );
};

module.exports = {
  createReservation,

  getReservations,
};
