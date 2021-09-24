const AuthorModel = require('../schema/author');
const BookModel = require('../schema/book');

const Router = require('express').Router();

//Place all routes here
//Route         -/book
//Description   - To get all books
//Access        -Public
//Method        -Get
//Params        -none
//Body          -none

Router.get("/", async (req, res) => {
    try{
      const getAllBooks = await BookModel.find();
    console.log(getAllBooks);
    return res.json(getAllBooks);
    }catch(e){
      return res.json(e.message)
    }
  });
  
  //Route         -/book/:bookId
  //Description   -To get a  book based on ISBN
  //Access        -Public
  //Method        -Get
  //Params        -bookID
  //Body          -none
  
  Router.get("/:bookID", async (req, res) => {
    // const getBook = Database.Book.filter(
    //     (book) => book.ISBN === req.params.bookID
    // );
    const getSpecificBook = await BookModel.findOne({ ISBN: req.params.bookID });
  
    if (!getSpecificBook) {
      return res.json({
        error: `No book found for thr ISBN of ${req.params.bookID}`,
      });
    }
    return res.json({ book: getSpecificBook });
  });
  
  //No two routes should have same structure
  
  //Route         -/book/c/:category
  //Description   -To get a list of books based on category
  //Access        -Public
  //Method        -Get
  //Params        -bookID
  //Body          -none
  
  //.includes will give a boolean value
  Router.get("/c/:category", async (req, res) => {
    // const getBook = Database.Book.filter(
    //     (book) => book.category.includes(req.params.category)
    // )
    const getSpecificBooks = await BookModel.findOne({
      category: req.params.category,
    });
    if (!getSpecificBooks) {
      return res.json({
        error: `No book found for the category of ${req.params.category}`,
      });
    }
    return res.json(getSpecificBooks);
  });

  //Route         -/book/new
//Description   -add new book
//Access        -Public
//Method        -post
//Params        -none

Router.post("/new", async (req, res) => {
    // const {newBook} = req.body;
    // //add new data
    // Database.Book.push(newBook);
    // return res.json(Database.Book);
    try {
      const { newBook } = req.body;
      await BookModel.create(newBook);
      return res.json({ message: "Book added to the database" });
    } catch (error) {
      console.log(error);
      return res.json({ message: error.message });
    }
  });

  //Route         -/book/update
//Description   -update any details of book
//Access        -Public
//Method        -put
//Params        -ISBN

//with the help of ISBN we can easily identify book data in database and update
Router.put("/updateTitle/:isbn", async (req, res) => {
    const { title } = req.body.title;
  
    const updateBook = await BookModel.findOneAndUpdate(
      {
        ISBN: req.params.isbn,
      },
      {
        title: title,
      },
      {
        new: true,
      }
    );
  
    return res.json({ book: updateBook });
  });
  
  //route :      /book/updateAuthor/:isbn
  //description: update/add new author to book
  //Access:      Public
  //Parameter:   isbn
  //method:      put
  Router.put("/updateAuthor/:isbn", async (req, res) => {
    const { newAuthor } = req.body;
    const { isbn } = req.params;
  
    const updateBook = await BookModel.findOneAndUpdate(
      {
        ISBN: isbn,
      },
      {
        $addToSet: {
          authors: newAuthor,
        },
      },
      {
        new: true,
      }
    );
  
    const updateAuthor = await AuthorModel.findOneAndUpdate(
      {
        id: newAuthor,
      },
      {
        $addToSet: {
          books: isbn,
        },
      },
      {
        new: true,
      }
    );
  
    return res.json({
      books: updateBook,
      author: updateAuthor,
      message: `New author was added in the database`,
    });
  });

  
/*
Route        /book/delete/:isbn
Description  delete a book
Access       PUBLIC
Parameters   isbn
Method       Delete
*/

Router.delete("/delete/:isbn", async (req, res) => {
    const { isbn } = req.params;
  
    const updateBokDatabase = await BookModel.findOneAndDelete({
      ISBN: isbn,
    });
  
    return res.json({ books: updateBokDatabase });
  });
  
  /*
  Route           /book/delete/author 
  Description     delete an author from a book
  Access          PUBLIC
  Parameters      id,isbn
  Method          Delete   
  */
  
  Router.delete("/delete/author/:isbn/:id", async (req, res) => {
    const { isbn, id } = req.params;
  
    //updating book database object
    const updateBook = await BookModel.findOneAndUpdate(
      {
        ISBN: isbn,
      },
      {
        $pull: {
          authors: parseInt(id),
        },
      },
      {
        new: true,
      }
    );
  
    const updateAuthor = await AuthorModel.findOneAndUpdate(
      {
        id: parseInt(id),
      },
      {
        $pull: {
          books: isbn,
        },
      },
      {
        new: true,
      }
    );
  
    return res.json({
      book: updateBook,
      author: updateAuthor,
      message: "Author was deleted",
    });
  });
  

module.exports = Router;