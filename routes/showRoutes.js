const router = require("express").Router();
const {
  addShow,
  getMovieShows,

  updateShowTickets,
  getShow,
  deleteShow,
  getAdminShows,
} = require("../controllers/showController");
const fetchUser = require("../middlewares/fetchUser");

router.post("/addshow", fetchUser, addShow);

router.get("/getmovieshows/:movieId", getMovieShows);
router.put("/updateshowtickets/:showId", updateShowTickets);
router.get("/getshow/:showId", getShow);
router.get("/getadminshows", fetchUser, getAdminShows);
router.delete("/deleteshow/:movieId/:showId", deleteShow);

module.exports = router;
