const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

const wikiSchema = mongoose.Schema({
    title: String,
    content: String
});

const Wiki = mongoose.model('articles',wikiSchema);

app.route('/articles')
    .get(function(req, res){
        Wiki.find()
            .then(function(element){
                res.send(element);
            })
            .catch(function(err){
                console.log(err);
            });
    })
    .post(function(req, res){
        const newData = new Wiki({
            title: req.body.title,
            content: req.body.content
        });
        newData.save()
            .then(()=>res.send('Posted Successfully'))
            .catch((err)=>console.log(err));
    })
    .delete(function(req, res){
        Wiki.deleteMany()
            .then(()=>res.send('Deleted Successfuly'))
            .catch((err)=>console.log(err));
    });

app.route('/articles/:articleTitle')
    .get(function(req, res){
        Wiki.findOne({title:req.params.articleTitle})
            .then((element)=>res.send(element))
            .catch((err)=>console.log(err));
    })
    .put(function(req, res){
        Wiki.findOneAndUpdate({title:req.params.articleTitle},{title:req.body.title, content:req.body.content},{overwrite:true})
        .then(()=>res.send('Updated Successfully'))
        .catch((err)=>console.log(err));
    })
    .patch(function(req, res){
        Wiki.findOneAndUpdate({title:req.params.articleTitle},req.body)
        .then(()=>res.send('Updated Successfully'))
        .catch((err)=>console.log(err));
    })
    .delete(function(req, res){
        Wiki.findOneAndDelete({title:req.body.title})
        .then(()=>res.send('Deleted Successfully'))
        .catch((err)=>console.log(err));
    });

app.listen(3000, function(){
    console.log('Server started on port 3000');
})