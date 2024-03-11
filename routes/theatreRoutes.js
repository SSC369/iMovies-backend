const router = require("express").Router();
const {
  addTheatre,
  getTheatre,
  getTheatres,
} = require("../controllers/theatreController");
const fetchUser = require("../middlewares/fetchUser");

router.post("/addtheatre", fetchUser, addTheatre);
router.get("/gettheatre/:theatreName", getTheatre);
router.get("/gettheatres", getTheatres);

module.exports = router;
