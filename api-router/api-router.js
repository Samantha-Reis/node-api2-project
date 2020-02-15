const express= require("express");
let posts= require('../data/db.js');

const router = express.Router();

router.get('/',(req,res)=>{
    posts.find()
        .then(response =>{
            console.log(response);
            res.status(200).json(response)
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json(err.message)
        })   
    })
  
router.get('/:id',(req,res)=>{
    posts.findById(req.params.id)
        .then(posts =>{
            if(posts){
                res.status(200).json(posts)
            }else{
                res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
        .catch(err =>{
            console.log(err);
            res.status(500).json({ error: "The post information could not be retrieved." })
        })  
})

router.get("/:id/comments",(req,res)=>{
    posts.findCommentById(req.params.id)
    .then(comments=>{
        if(comments){
          res.status(200).json(comments)
        }else{
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json(`{ error: "The comments information could not be retrieved." }`);
    })
  })

router.post('/', (req,res)=>{
    if(req.body.title && req.body.contents){
        const newPost ={
            title: req.body.title,
            contents: req.body.contents,
        }
        posts.insert(newPost)
        res.status(201).json(newPost)
    }else if(!req.body.title || !req.body.contents){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }else{
        res.status(500).json({ error: "There was an error while saving the post to the database" })
    }
})

router.put('/:id',(req,res)=>{
    const {id} = req.params;
    const updatedPost = req.body;
    if(updatedPost.title && updatedPost.contents) {
        posts.findById(id)
        .then(()=>{
            posts.update(id, updatedPost)
            .then(num =>{
                res.status(200).json({message: 'post updated', post: updatedPost});
            })
            .catch(error=>{
                console.log(error);
                res.status(500).json({message: 'something went wrong'})
            })
        })
    }
})

router.delete('/:id', (req,res)=>{
        posts.remove(req.params.id)
            .then(count =>{
                if(count > 0){
                    res.status(200).json({message: "The post has been removed"})
                }else{
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                }
            })
            .catch(err =>{
                console.log(err);
                res.status(500).json({ 
                    message: "The post information could not be deleted." })
            })  
    })

    router.put("/:id",(req,res)=>{
        const post=req.body
        posts.update(req.params.id,post)
        .then(posts=>{
            console.log(posts)
          if(req.body.title && req.body.contents){
            res.status(200).json({message: "User Updated"})
          }else if(!req.body.title || !req.body.contents){
            res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
          }else{
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
      })
          .catch(err=>{
            console.log(err);
            res.status(500).json({ errorMessage: "The user information could not be modified." })
          })
        })

module.exports= router