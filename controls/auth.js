

exports.getSignup = (req, res, next) => {
    res.render('signup');
};

exports.getLogin = (req, res, next) => {
    res.render('login');
};

exports.getHomepage = (req, res, next) => {
    res.render('homepage');
};