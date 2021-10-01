const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/WikiDB');


const articleSchema = {
    title:{
        type: String,
        required: true
        
    },
    content: {
        type: String,
        required: true
        
    }
}

const Article = mongoose.model('Article', articleSchema);

app.route("/articles")
    .get(function(req, res) {

        Article.find({}, function(err, articles) {
            if(err){
                console.log(err);
            }
            else{
                res.send(articles);
            }
        });
    })
    .post(function(req, res){

        let article = new Article({
            title: req.body.title,
            content: (req.body.content)
        });
        article.save(function(err){
            if(err){
                res.send(err);
            }
            else{
                res.send("Successfully added a new article");
            }
        });
    })

    .delete(function(req, res){
        Article.deleteMany({}, function(err){
            if(err){
                res.send(err);
            }
            else{
                res.send("Successfully deleted all articles");
            }
        })
    });

app.route("/articles/:article_title")


    .get(function(req, res){
        const titleSearch = _.trim(req.body.title);
        const title = _.startCase(titleSearch);
        Article.findOne({title: title}, function(err, article){
            if(err){
                res.send(err);
            }
            else{
                if(article){
                    res.send(article);
                }
                else{
                    res.send("No article found");
                }
            }
        });
    })
    
    .put(function(req, res){
        const changedArticle = req.params.article_title;
        console.log(req.body);
        Article.updateOne({title: changedArticle}, {title: req.body.newTitle, content: req.body.newContent}, function(err){
            if(err){
                res.send(err);
            }
            else{
                res.send("Successfully updated");
            }
        });
    })

    .patch(function(req, res){
        const changedArticle = req.params.article_title;
        console.log(req.body);
        Article.updateOne({title: changedArticle}, {$set:{title: req.body.newTitle}}, function(err){
            if(err){
                res.send(err);
            }
            else{
                res.send("Successfully updated");
            }
        });
    })

    .delete(function(req, res){
        Article.deleteOne({title: req.params.article_title}, function(err){
            if(err){
                res.send(err);
            }
            else{
                res.send("Successfully deleted");
            }
        })
        

    });

app.listen(3000, function() {
    console.log("Server listening on port 3000");
})
