const Show = require("../models/showModel");
const Movie = require("../models/movieModel");
const Theatre = require("../models/theatreModel");
const { v4 } = require("uuid");

module.exports.addShow = async (req, res, next) => {
  try {
    const { theatre, showtime, showdate, showId, movieId } = req.body;
    const findMovie = await Movie.findOne({ movieId });
    const movieShows = findMovie?.shows;

    const lowercaseTheatre = theatre.toLowerCase();
    if (movieShows.length >= 1) {
      const isFound = await Promise.all(
        movieShows.map(async (s) => {
          const show = await Show.findOne({ showId: s });

          const isSameTheatre = show?.theatreName === lowercaseTheatre;

          return (
            show.showdate === showdate &&
            show.showtime === showtime &&
            isSameTheatre
          );
        })
      );

      console.log(isFound);

      if (isFound.includes(true)) {
        return res.json({
          status: false,
          msg: "Show is already Created:)",
        });
      }
    }

    console.log(showdate);
    const adminEmail = req.user.adminDetails.email;

    const show = await Show.create({
      movieId,
      theatreName: lowercaseTheatre,
      showtime,
      adminEmail,
      showId,
      showdate,
      tickets: {},
    });

    const updated = await Movie.updateOne(
      { movieId },
      {
        $addToSet: {
          shows: showId,
          theatres: lowercaseTheatre,
        },
      }
    );

    return res.json({ status: true, msg: "Show Saved successfully :)" });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: "Server issue :(" });
  }
};

module.exports.updateShowTickets = async (req, res, next) => {
  try {
    const { showId } = req.params;
    const bookedTickets = req.body;

    const findShow = await Show.findOne({ showId });
    const prevShowTickets = findShow?.tickets;

    const modifiedShowTickets = {
      balcony: { ...prevShowTickets?.balcony, ...bookedTickets?.balcony },
      middle: { ...prevShowTickets?.middle, ...bookedTickets?.middle },
      lower: { ...prevShowTickets?.lower, ...bookedTickets?.lower },
    };

    const show = await Show.updateOne(
      { showId },
      { $set: { tickets: modifiedShowTickets } }
    );
    return res.json({ status: false, msg: "Seats updated successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: "Server issue :)" });
  }
};

module.exports.getMovieShows = async (req, res, next) => {
  try {
    const { movieId } = req.params;

    const getMovie = await Movie.findOne({ movieId });

    const movieShows = getMovie?.shows;

    const showData = await Promise.all(
      movieShows?.map(async (s) => {
        const show = await Show.findOne({ showId: s });

        const upperCaseTheatreName =
          show?.theatreName[0].toUpperCase() + show?.theatreName.slice(1);

        const showDetails = {
          showtime: show?.showtime,
          showdate: show?.showdate,
          theatre: upperCaseTheatreName,
          showId: show?.showId,
        };

        return showDetails;
      })
    );

    return res.json({ status: true, showData });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: "Server issue :)" });
  }
};

module.exports.getShow = async (req, res) => {
  try {
    const { showId } = req.params;
    const show = await Show.findOne({ showId });
    return res.json({ status: true, show });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: "Server issue :)" });
  }
};

module.exports.getAdminShows = async (req, res) => {
  try {
    const { email } = req.user.adminDetails;

    const shows = await Show.find({ adminEmail: email });

    const updated = await Promise.all(
      shows.map(async (s) => {
        const movie = await Movie.findOne({ movieId: s.movieId });

        const {
          adminEmail,
          showId,
          movieId,
          theatreName,
          showdate,
          showtime,
          tickets,
        } = s;

        return {
          adminEmail,
          showId,
          movieId,
          theatreName,
          showdate,
          showtime,
          tickets,
          movieName: movie?.movieName,
        };
      })
    );

    return res.json({ status: true, adminShows: updated });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: "Server issue :)" });
  }
};

module.exports.deleteShow = async (req, res) => {
  try {
    const { showId, movieId } = req.params;
    const findMovie = await Movie.findOne({ movieId });
    const prevMovieShows = findMovie.shows;
    const filteredShows = prevMovieShows.filter((s) => s !== showId);
    await Movie.updateOne(
      { movieId },
      {
        $set: {
          shows: filteredShows,
        },
      }
    );

    await Show.deleteOne({ showId });
    return res.json({ status: true, msg: "Show deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: "Server issue :)" });
  }
};
