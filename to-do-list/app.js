const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const date = require(__dirname+'/datemod.js');
const _ = require('lodash');

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect('mongodb://127.0.0.1:27017/todoListDB');

const task = new mongoose.Schema({
    name: String
});

const Item = mongoose.model('Task',task)


const defaultItems = [];

const customListScheme = {
    name: String,
    items: [task]
};

const List = mongoose.model('List',customListScheme);

app.get('/', function(req,res){

    Item.find({})
    .then(function(element){
        const day = date.getDate();
        res.render('list', {listTitle:day, newItem:element});
    })
    .catch(function(err){
        console.log(err);
    });
})

app.post('/', function(req,res){

    const listName = req.body.list;
    const newItem = new Item({
        name:req.body.todo
    });

    if(req.body.todo != ''){
        if(listName === date.getDate()){
            newItem.save();
            res.redirect('/');
        }else{
            List.findOne({name:listName})
            .then(function(element){
                element.items.push(newItem);
                element.save();
            })
            .catch(function(err){
                console.log(err);
            })
            res.redirect('/'+listName);
        }
    }
    
})

app.post('/delete', function(req, res){
    const listName = req.body.listName;
    
    if(listName===date.getDate()){
        Item.findByIdAndRemove(req.body.checkbox)
        .then(function(){
            console.log('Removed task from database');
        })
        .catch(function(err){
            console.log(err);
        });
        res.redirect('/');
    }else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:req.body.checkbox}}})
        .then(function(){
            console.log('Item removed from list');
            res.redirect('/'+listName);
        })
        .catch(function(err){
            console.log(err);
        });
    }
    
});


app.get('/:Param', function(req, res){
    const customListTitle = _.capitalize(req.params.Param)
    List.find({name:customListTitle})
    .then(function(element){
        if(element.length===0){
            const list = new List({
                name: customListTitle,
                items: defaultItems
            })
            list.save();
            res.redirect('/'+customListTitle);
        }
        else{
            element.forEach(function(el){
                if(req.params.Param === el.name){
                    res.render('list',{listTitle:customListTitle, newItem:el.items})
                };
            })
            
        }
    })
    .catch(function(err){
        console.log(err);
    });

});

app.listen(3000, function(){
    console.log('Server started running on port 3000');
})