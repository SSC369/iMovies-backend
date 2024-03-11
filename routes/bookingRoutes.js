const router = require("express").Router();
const fetchUser = require("../middlewares/fetchUser");
const { addBooking, getBookings } = require("../controllers/bookingController");

router.post("/addbooking", fetchUser, addBooking);
router.get("/getbookings", fetchUser, getBookings);
module.exports = router;
