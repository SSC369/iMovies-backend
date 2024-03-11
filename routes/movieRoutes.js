const router = require("express").Router();
const fetchUser = require("../middlewares/fetchUser");
const {
  addMovie,
  getMovies,
  getMovieDetails,
} = require("../controllers/movieController");

router.post("/addmovie", fetchUser, addMovie);
router.get("/getmoviedetails/:movieId", getMovieDetails);
router.get("/getmovies", getMovies);
module.exports = router;
