const {
    notFoundHandler,
    addBooksHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    updateBookHandler,
    deleteBookHandler,
} = require("./handler");

const routes = [
    {
        method: "*",
        path: "/{any*}",
        handler: notFoundHandler,
    },
    {
        method: "POST",
        path: "/books",
        handler: addBooksHandler,
    },
    {
        method: "GET",
        path: "/books",
        handler: getAllBooksHandler,
    },
    {
        method: "GET",
        path: "/books/{bookid}",
        handler: getBookByIdHandler,
    },
    {
        method: "PUT",
        path: "/books/{bookid}",
        handler: updateBookHandler,
    },
    {
        method: "DELETE",
        path: "/books/{bookid}",
        handler: deleteBookHandler,
    },
];

module.exports = routes;
