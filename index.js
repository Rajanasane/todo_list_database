const express = require('express')
const bodyParser = require('body-parser')

var app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

const trySchema = new mongoose.Schema({
    name : String
})

const item = mongoose.model("list",trySchema)

const todo1 = new item({
    name : "learning"
})
// todo1.save();
const todo2 = new item({
    name : "learning"
})
// todo2.save();
const todo3 = new item({
    name : "learning"
})
// todo3.save();

app.get('/',function(req,res){
    item.find({})
        .then(foundItems =>
            res.render("list",{ejes : foundItems}))
        .catch(err =>
            console.log(err))
    })

app.post('/',function(req,res){
    const itemName = req.body.ele1
    const todo4 = new item ({
        name : itemName
    })
    todo4.save()
    res.redirect('/')
})

app.post('/delete',function(req,res){
    const checked = req.body.checkbox1
    item.findByIdAndDelete(checked)
        .then(() => {
            console.log("Deleted");
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        });
    })

app.listen(5000,function(){
    console.log("server started")
})
