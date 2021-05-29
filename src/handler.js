const books = require("./books");
const { nanoid } = require("nanoid");

const notFoundHandler = (req, h) => {
    const response = h.response({
        status: "fail",
        message: "Page not found",
    });
    response.code(404);
    return response;
};

const addBooksHandler = (req, h) => {
    const data = req.payload;
    const finished = data.pageCount === data.readPage;
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const book = { ...data, id, insertedAt, updatedAt, finished };

    // ----- No name -----
    if (data.name === undefined) {
        const res = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku",
        });
        res.code(400);
        return res;
    }

    // ----- readPage > pageCount -----
    if (data.readPage > data.pageCount) {
        const res = h.response({
            status: "fail",
            message:
                "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
        });
        res.code(400);
        return res;
    }

    books.push(book);
    const valid = books.filter((book) => book.id === id).length > 0;

    if (valid) {
        const res = h.response({
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
                bookId: id,
            },
        });
        res.code(201);
        return res;
    }

    // ----- SUCCESS -----

    // ----- Generic error -----
    const res = h.response({
        status: "error",
        message: "Buku gagal ditambahkan",
    });
    res.code(500);
    return res;
};

const getAllBooksHandler = (req, h) => {
    const { reading, finished, name } = req.query;
    let filteredBooks = books;
    console.log("===========================================");

    if (reading !== undefined) {
        // const readingStatus = reading === 0 ? false : true;
        filteredBooks = filteredBooks.filter((book) => book.reading == reading);
    }

    if (finished !== undefined) {
        // const finishedStatus = finished === 0 ? false : true;
        filteredBooks = filteredBooks.filter(
            (book) => book.finished == finished
        );
    }

    if (name !== undefined) {
        filteredBooks = filteredBooks.filter((book) =>
            book.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    filteredBooks = filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
    }));

    const res = h.response({
        status: "success",
        data: {
            books: filteredBooks,
        },
    });

    res.code(200);
    return res;
};

const getBookByIdHandler = (req, h) => {
    const { bookid } = req.params;
    const book = books.filter((book) => book.id === bookid)[0];

    // ----- No ID -----
    if (book !== undefined) {
        const res = h.response({
            status: "success",
            data: {
                book,
            },
        });

        res.code(200);
        return res;
    }

    const res = h.response({
        status: "fail",
        message: "Buku tidak ditemukan",
    });

    res.code(404);
    return res;
};

const updateBookHandler = (req, h) => {
    const data = req.payload;
    const { bookid } = req.params;
    const finished = data.pageCount === data.readPage;
    const updatedAt = new Date().toISOString();

    const book = { ...data, updatedAt, finished };

    // ----- No name -----
    if (data.name === undefined) {
        const res = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku",
        });
        res.code(400);
        return res;
    }

    // ----- readPage > pageCount -----
    if (data.readPage > data.pageCount) {
        const res = h.response({
            status: "fail",
            message:
                "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
        });
        res.code(400);
        return res;
    }

    // ----- ID not found -----

    const index = books.findIndex((book) => book.id === bookid);

    if (index !== -1) {
        books[index] = {
            ...books[index],
            ...book,
        };

        const res = h.response({
            status: "success",
            message: "Buku berhasil diperbarui",
        });
        res.code(200);

        return res;
    } else {
        const res = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Id tidak ditemukan",
        });
        res.code(404);
        return res;
    }
};

const deleteBookHandler = (req, h) => {
    const { bookid } = req.params;
    const index = books.findIndex((book) => book.id === bookid);

    if (index === -1) {
        const res = h.response({
            status: "fail",
            message: "Buku gagal dihapus. Id tidak ditemukan",
        });
        res.code(404);
        return res;
    } else {
        books.splice(index, 1);
        const res = h.response({
            status: "success",
            message: "Buku berhasil dihapus",
        });
        res.code(200);
        return res;
    }
};

module.exports = {
    notFoundHandler,
    addBooksHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    updateBookHandler,
    deleteBookHandler,
};
