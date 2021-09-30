const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
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
        Article.findOne({title: req.body.article_title}, function(err, article){
            if(err){
                res.send(err);
            }
            else{
                res.send(article);
            }
        });
    });


app.listen(3000, function() {
    console.log("Server listening on port 3000");
})
