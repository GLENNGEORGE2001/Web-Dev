const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname+'/datemod.js');

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

const item = [];
const workItem = [];

app.get('/', function(req,res){
    const day = date.getDate();
    res.render('list', {listTitle:day, newItem:item});
})

app.post('/', function(req,res){
    if(req.body.list==='Work'){
        if(req.body.todo != ''){
            workItem.push(req.body.todo)
        }
        res.redirect('/work');
    }else{
        if(req.body.todo != ''){
            item.push(req.body.todo)
        }
        res.redirect('/');
    }
})

app.get('/work', function(req, res){
    res.render('list', {listTitle:'Work', newItem:workItem});
})

app.listen(3000, function(){
    console.log('Server started running on port 3000');
})