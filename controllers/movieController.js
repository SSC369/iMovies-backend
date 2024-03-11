const Movie = require("../models/movieModel");
const { v4 } = require("uuid");

module.exports.addMovie = async (req, res, next) => {
  try {
    const {
      name,
      description,
      genres,
      releaseDate,
      runtime,
      certification,
      media,
      movieId,
    } = req.body;

    //check is movie is already added into db
    const lowerCaseName = name.toLowerCase();
    const movie = await Movie.findOne({ movieName: lowerCaseName });

    if (movie)
      return res.json({ status: false, msg: "Movie is already Saved:)" });

    if (!movie) {
      const movieData = {
        movieName: lowerCaseName,
        description,
        genres,
        releaseDate,
        runtime,
        certification,
        media,
        shows: [],
        theatres: [],
        movieId,
      };
      await Movie.create(movieData);

      return res.json({ status: true, msg: "Movie Saved successfully :)" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: "Server issue :(" });
  }
};

module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find();

    return res.json({ status: true, movies });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: "Server issue :(" });
  }
};

module.exports.getMovieDetails = async (req, res, next) => {
  try {
    const { movieId } = req.params;

    const movie = await Movie.findOne({ movieId });

    return res.json({ status: true, movie });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: "Server issue :)" });
  }
};
