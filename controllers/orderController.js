const db = require("../config/db");

// Create Order
const createOrder = (req, res) => {
  const {
    customer_name,
    email,
    phone,
    address,
    city,
    state,
    pincode,
    items,
    subtotal,
    gst,
    delivery_charge,
    total,
    payment_method,
  } = req.body;

  if (
    !customer_name ||
    !email ||
    !phone ||
    !address ||
    !city ||
    !state ||
    !pincode
  ) {
    return res.status(400).json({
      success: false,
      message: "Please fill all required fields.",
    });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Cart is empty.",
    });
  }

  const sql = `
  INSERT INTO orders
  (
    customer_name,
    email,
    phone,
    address,
    city,
    state,
    pincode,
    items,
    subtotal,
    gst,
    delivery_charge,
    total,
    payment_method
  )
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
  `;

  db.query(
    sql,
    [
      customer_name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      JSON.stringify(items),
      subtotal,
      gst,
      delivery_charge,
      total,
      payment_method,
    ],
    (err) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          success: false,
          message: "Internal Server Error",
        });
      }

      res.status(201).json({
        success: true,
        message: "Order Saved Successfully",
      });
    },
  );
};

// Get All Orders
const getOrders = (req, res) => {
  db.query("SELECT * FROM orders ORDER BY id DESC", (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }

    res.json(result);
  });
};

// Get One Order
const getOrderById = (req, res) => {
  db.query(
    "SELECT * FROM orders WHERE id=?",
    [req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(result);
    },
  );
};

// Delete Order
const deleteOrder = (req, res) => {
  db.query("DELETE FROM orders WHERE id=?", [req.params.id], (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      success: true,
      message: "Order Deleted",
    });
  });
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  deleteOrder,
};
