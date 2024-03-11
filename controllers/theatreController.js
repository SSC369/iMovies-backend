const Theatre = require("../models/theatreModel");

module.exports.addTheatre = async (req, res, next) => {
  try {
    const {
      theatreName,
      location,
      balconySeatPrice,
      middleSeatPrice,
      lowerSeatPrice,
      balconySeats,
      middleSeats,
      lowerSeats,
      theatreId,
    } = req.body;

    //check is theatre is already existed
    const lowerCaseName = theatreName.toLowerCase();
    const findTheatre = await Theatre.findOne({ theatreName: lowerCaseName });

    if (findTheatre) {
      return res.json({
        status: false,
        msg: "Theatre is already Registered",
      });
    }

    const adminName = req?.user?.adminDetails?.adminName;
    const adminEmail = req?.user?.adminDetails?.adminEmail;
    await Theatre.create({
      theatreName: lowerCaseName,
      location,
      adminName,
      balconySeatPrice,
      middleSeatPrice,
      lowerSeatPrice,
      balconySeats,
      middleSeats,
      lowerSeats,
      theatreId,
      adminEmail,
    });

    return res.json({ status: true, msg: "Theatre added successfully :)" });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: "Server issue :(" });
  }
};

module.exports.getTheatre = async (req, res, next) => {
  try {
    const { theatreName } = req.params;
    const theatre = await Theatre.findOne({ theatreName });
    return res.json({ status: true, theatre });
  } catch (error) {
    return res.json({ status: false, msg: "Server issue :(" });
  }
};

module.exports.getTheatres = async (req, res, next) => {
  try {
    const theatres = await Theatre.find();
    console.log(theatres);
    return res.json({ status: true, theatres });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: "Server issue :(" });
  }
};
