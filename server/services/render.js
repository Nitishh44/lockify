
const Password = require('../model/passwordModel');


exports.homeRoutes = async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  try {
    const entries = await Password.find({
      userId: req.session.user.id
    });

    res.render('index', { entries });
  } catch (err) {
    console.error(err);
    res.send('Error loading dashboard');
  }
};




exports.add_entry = (req, res) => {
    res.render('add-password');
    // Add password ka form page render karta hai
}

exports.update_entry = async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  try {
    const entry = await Password.findOne({
      _id: req.query.id,
      userId: req.session.user.id
    });

    if (!entry) {
      return res.send("Entry not found");
    }

    res.render("update_entry", { entry });
  } catch (err) {
    console.error(err);
    res.send("Error loading update page");
  }
};

