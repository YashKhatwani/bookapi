require("dotenv").config();//importingdotnev
const express = require("express");//imported express
const mongoose = require('mongoose');

//database -imported
const Database = require("./database");

mongoose.connect(
    process.env.MONGO_URI,{
        useNewUrlParser: true,
}
).then(()=> console.log('connection established')).catch((err) => {
    console.log(err);
});
//symbol " / " is known as route

//Initialization
const OurApp = express();

//It makes us able to pass json and read json data
OurApp.use(express.json());

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
//Description- To get all authors
//Access -Public
//Method -Get
//Params -none
//Body -none

OurApp.get("/author",(req,res) => {
    return res.json({authors: Database.Author});
});

OurApp.get("/author/:aid",(req,res) => {
    const getAuthor = Database.Author.filter((author) => author.id ===parseInt(req.params.aid));
    return res.json({author: getAuthor});
});

OurApp.get("/publication",(request,response) => {
    return response.json({publications: Database.Publication});
});

OurApp.get("/publication/:pid",(request,response) => {
    const getPublication = Database.Publication.filter((publication) => publication.id === Number(request.params.pid));
    return response.json({publication: getPublication});
});

//Route         -/book/new
//Description   -add new book
//Access        -Public
//Method        -post
//Params        -none

OurApp.post("/book/new",(req,res) => {
    const {newBook} = req.body;

    //add new data
    Database.Book.push(newBook);


    return res.json(Database.Book);
});

//Route         -/author/new
//Description   -add new author
//Access        -Public
//Method        -post
//Params        -none

OurApp.post("/author/new",(req,res) => {
    const {newAuthor} = req.body;//Destructuring of data { var name }
    //const newAuthor = req.body.Author is 2nd way
    Database.Author.push(newAuthor);

    return res.json(Database.Author);
});

OurApp.post("/publication/new",(req,res) => {
    const {newPublication} = req.body;

    Database.Publication.push(newPublication);

    return res.json(Database.Publication);
});

//Route         -/book/update
//Description   -update any details of book
//Access        -Public
//Method        -put
//Params        -ISBN

//with the help of ISBN we can easily identify book data in database and update
OurApp.put("/book/update/:isbn" , (req,res) => {
    const { updatedBook } = req.body;
    const { isbn } = req.params;

    const book = Database.Book.map((book) => {
        if(book.ISBN === isbn){
            console.log({...book,...updatedBook});
            return { ...book, ...updatedBook };
        }
        return book;
    })

    return res.json(book);
});

//route : /book/update
//description: update/add new author to book
//Access:     Public
//Parameter:   isbn
//method:      put
OurApp.put("/bookAuthor/update/:isbn" , (req,res) => {
    const {newAuthor} = req.body;
    const {isbn} = req.params;

    Database.Book.map((book) => {
        if(book.ISBN === isbn){
            if(!book.authors.includes(newAuthor)){ 
                //If not, then return new author           
                book.authors.push(newAuthor);
                return book;
            }
            //else return
            return book;
        }
        return book;
    });
    //we can use forEach instead of map
    Database.Author.map((author) => {
        if(author.id === newAuthor){
            if(!author.books.includes(isbn)){
                author.books.push(isbn);
                return author;
            }
            return author;
        }
    return author;
    });

    return res.json({book: Database.Book , author: Database.Author});
});

//Todo Create a route for author update
//route         /author/update
//description   Update any detail of author
//Access        Public
//Parameters    id
//Method        Put

OurApp.put("/author/update/:id", (req,res) => {
    const { updateAuthor} = req.body;
    const { id} = req.params;

    const author = Database.Author.map((author) => {
        if(author.id === parseInt(id)){
            console.log({...author,...updateAuthor});
            return {...author,...updateAuthor};
        }
        return author;
    });
    return res.json(author);
});

OurApp.put("/author/updateName/:id",(req,res) =>{
    const {updateAuthorName} = req.body;
    const{ id } = req.params;

    const updateName = Database.Author.map((author) => {
        if(author.id === parseInt(id)){
            author.name = updateAuthorName.name;
            return author;
        }
        return author;
    });
    return res.json(updateName);
});

/*
Route        /book/delete/:isbn
Description  delete a book
Access       PUBLIC
Parameters   isbn
Method       Delete
*/

OurApp.delete("/book/delete/:isbn", (req,res) =>{
    const { isbn } = req.params;
    
    const filteredBooks = Database.Book.filter((book) => book.ISBN !== isbn);

    Database.Book = filteredBooks;

    return res.json(Database.Book);
});

/*
Route           /book/delete/author 
Description     delete an author from a book
Access          PUBLIC
Parameters      id,isbn
Method          Delete   
*/

OurApp.delete('/book/delete/author/:isbn/:id', (req,res) => {
    const{isbn , id} = req.params;

    //updating book database object
    Database.Book.forEach((book) => {
        if(book.ISBN === isbn){
            if(!book.authors.includes(parseInt(id))){
                return ;
            }
            book.authors = book.authors.filter((databaseid) => databaseid !== parseInt(id));

            return book;
        }
        return book;
    })

    Database.Author.forEach((author) => {
        if(author.id === (parseInt(id))){
            if(!author.books.includes(isbn)){
                return author;
            }

            author.books = author.books.filter((book) => book!== isbn);

            return author;
        }
        return author;
    })

    return res.json({book: Database.Book , author: Database.Author});
});

/*
Route       /author/delete
description delete an author
access      public
params      id
Method      Delete
*/

OurApp.delete('/author/delete/:id',(req,res) =>{
    const {id} = req.params;

    const filteredAuthors = Database.Author.filter((author) => author.id !== parseInt(id));

    Database.Author = filteredAuthors;

    return res.json(Database.Author);
});

/*
Route       /publication/delete
description delete an publication
access      public
params      id
Method      Delete
*/

OurApp.delete('/publication/delete/:id',(req,res) =>{
    const {id} = req.params;

    const filteredPublications = Database.Publication.filter((publication) => publication.id !== parseInt(id));

    Database.Publication = filteredPublications;

    return res.json( Database.Publication);
});

/*
route           /publication/delete/book      
description     delete a book from publication
access          Public
params          id,isbn
method          delete
*/

OurApp.delete('/publication/delete/book/:id/:isbn',(req,res) => {
    const { id ,isbn} = req.params;

    Database.Book.forEach((book) => {
        if(book.ISBN === isbn){
            book.publication = 0;
            return book;
        }
        return book;
    })

    Database.Publication.forEach((pub) =>{
        if(pub.id === parseInt(id)){
            const filteredBooks = pub.books.filter((book) => book !== isbn );
            pub.books = filteredBooks;
            return pub; 
        }
        return pub;
    });

    return res.json({book: Database.Book , publication: Database.Publication});
});

OurApp.listen(4000, () => console.log("Server is running"));
//localhost4000 - rootroute


//npm run dev - to run server