const Booking = require("../models/bookingModel");
const Show = require("../models/showModel");
const Movie = require("../models/movieModel");

module.exports.addBooking = async (req, res) => {
  try {
    const { bookingId, showId, ticketsData } = req.body;
    const userEmail = req.user.userDetails.email;

    await Booking.create({
      bookingId,
      userEmail,
      showId,
      ticketsData,
    });

    return res.json({ status: true, msg: "Tickets booked successfully:)" });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: "Server issue :(" });
  }
};

module.exports.getBookings = async (req, res) => {
  try {
    const userEmail = req.user.userDetails.email;
    const getBookings = await Booking.find({ userEmail });

    const bookings = await Promise.all(
      getBookings.map(async (b) => {
        const show = await Show.findOne({ showId: b.showId });
        const movie = await Movie.findOne({ movieId: show.movieId });
        const data = {
          bookingId: b.bookingId,
          userEmail,
          ticketsData: b.ticketsData,
          theatreName: show.theatreName,
          showdate: show.showdate,
          showtime: show.showtime,
          movieName: movie.movieName,
          media: movie.media,
        };
        return data;
      })
    );

    return res.json({ status: true, bookings });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: "Server issue :(" });
  }
};
