const AuthorModel = require('../schema/author');


const Router = require('express').Router();

//Place all routes here
//Route -/Author
//Description- To get all authors
//Access -Public
//Method -Get
//Params -none
//Body -none

Router.get("/", async (req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);
  });
  
  Router.get("/:aid",async (req, res) => {
    // const getAuthor = Database.AuthorModel.filter(
    //   (author) => author.id === parseInt(req.params.aid)
    // );
    // const getspecificAuthor = await 
    // return res.json({ author: getAuthor });

  });

  
//Route         -/author/new
//Description   -add new author
//Access        -Public
//Method        -post
//Params        -none

Router.post("/new", (req, res) => {
    const { newAuthor } = req.body; //Destructuring of data { var name }
    //const newAuthor = req.body.Author is 2nd way
    AuthorModel.create(newAuthor);
  
    return res.json({ message: `Author added to database` });
  });

  
//Todo Create a route for author update
//route         /author/update
//description   Update any detail of author
//Access        Public
//Parameters    id
//Method        Put

Router.put("/update/:id", (req, res) => {
    const { updateAuthor } = req.body;
    const { id } = req.params;
  
    const author = Database.Author.map((author) => {
      if (author.id === parseInt(id)) {
        console.log({ ...author, ...updateAuthor });
        return { ...author, ...updateAuthor };
      }
      return author;
    });
    return res.json(author);
  });
  
  Router.put("/updateName/:id",async (req, res) => {
    const { updateAuthorName } = req.body.name;
    const { id } = req.params;
    
    const updateAuthor = await AuthorModel.findOneAndUpdate(
      {
        id: parseInt(id),
      },
      {
        name: updateAuthorName,
      },
      {
        new: true,
      }
    );
    
    return res.json({ author:updateAuthor });
  });
  
  /*
  Route       /author/delete
  description delete an author
  access      public
  params      id
  Method      Delete
  */
  
  Router.delete("/delete/:id", (req, res) => {
    const { id } = req.params;
  
    const updateAuthor = AuthorModel.findOneAndDelete({
      id: parseInt(id),
    });
  
    return res.json({
      author: updateAuthor,
      messege: `Author deleted successfully`,
    });
  });
  

module.exports = Router;