const wrapAsync = (fn) => {
    return function (req, res, next) {
        // Make sure to `.catch()` any errors and pass them along to the `next()`
        // middleware in the chain, in this case the error handler.
        fn(req, res, next).catch(next);
    };
};

const getTime = () => {
    now = new Date().toISOString().slice(0,19).replace('T',' ')
    return now
}

module.exports = {
    wrapAsync,
    getTime,
};
