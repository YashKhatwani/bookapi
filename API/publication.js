const BookModel = require('../schema/book');
const PublicationModel = require('../schema/publication');


const Router = require('express').Router();

//Place all routes here
Router.get("/",async (req, res) => {
    const getAllPublication = await PublicationModel.find();
    return res.json(getAllPublication);
  });
  
  Router.get("/:pid",async (request, response) => {
    const getPublication = await PublicationModel.findOne({id:request.params.pid});

    return response.json({ publication: getPublication });
  });
  
  Router.post("/new",async (req, res) => {
    try{
    const { newPublication } = req.body;
    await PublicationModel.create(newPublication)
    return res.json({message: "Publication added successfully"});
    } catch (e){
      console.log(e);
      return res.json({ message : e.message})
    }
  });
  
  /*
  Route       /publication/delete
  description delete an publication
  access      public
  params      id
  Method      Delete
  */
  
  Router.delete("/delete/:id",async (req, res) => {
    const { id } = req.params;
  
    const updatedPublications = await PublicationModel.findOneAndDelete({
        id: parseInt(id),
    }) 
    
    return res.json({ publications: updatedPublications});
  });
  
  /*
  route           /publication/delete/book      
  description     delete a book from publication
  access          Public
  params          id,isbn
  method          delete
  */
  
  Router.delete("/delete/book/:id/:isbn",async (req, res) => {
    const { id, isbn } = req.params;
  
    const updateBook =await BookModel.findOneAndUpdate(
      {
        ISBN : isbn,
      },
      {
        $set:{
          publication : 0,
        },
      },
      {
        new:true,
      }
    )
  
    const updatePublications = await PublicationModel.findOneAndUpdate(
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
      author: updatePublications,
      message: "Publication was deleted",
    });
  });

module.exports = Router;