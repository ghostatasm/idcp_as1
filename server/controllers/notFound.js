const notFoundPage = (req, res) => {
    res.status(404).render('notFound');
};

module.exports = {
    notFoundPage,
};