const express = require("express");//imported express

//database -imported
const Database = require("./database");

//symbol " / " is known as route

//Initialization
const OurApp = express();

OurApp.get("/",(request , response) => {
    response.json({message :"Server is working!!"});
});

//Route         -/book
//Description   - To get all books
//Access        -Public
//Method        -Get
//Params        -none
//Body          -none

OurApp.get("/book",(req,res) => {
    return res.json({books: Database.Book});
});

//Route         -/book/:bookId
//Description   -To get a  book based on ISBN
//Access        -Public
//Method        -Get
//Params        -bookID
//Body          -none

OurApp.get("/book/:bookID" , (req,res)=>{
    const getBook = Database.Book.filter(
        (book) => book.ISBN === req.params.bookID
    );

    return res.json({ book: getBook})
});

//No two routes should have same structure

//Route         -/book/c/:category
//Description   -To get a list of books based on category
//Access        -Public
//Method        -Get
//Params        -bookID
//Body          -none

//.includes will give a boolean value
OurApp.get("/book/c/:category" , (req,res)=>{
    const getBook = Database.Book.filter(
        (book) => book.category.includes(req.params.category)
    )

    return res.json({ book: getBook})
});

//Route -/Author
//Description- To get all books
//Access -Public
//Method -Get
//Params -none
//Body -none

OurApp.get("/author",(req,res) => {
    return res.json({author: Database.Author});
});

OurApp.get("/author/:aid",(req,res) => {
    const getAuthor = Database.Author.filter((author) => author.id === req.params.aid);

    return res.json({author: getAuthor});
});

// OurApp.get("/book/:bookID" , (req,res)=>{
//     const getBook = Database.Book.filter(
//         (book) => book.ISBN === req.params.bookID
//     );

//     return res.json({ book: getBook})
// });

OurApp.listen(4000, () => console.log("Server is running"));
//localhost4000 - rootroute


//npm run dev