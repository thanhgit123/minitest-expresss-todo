const express = require('express');
const app = express();
const PORT = 7000;
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const readDb = fs.readFileSync('db.json');
const data = JSON.parse(readDb);

app.get('/api/v1/todos',async(req,res)=>{
    const {per_page} = req.query;
    const arrSlice = data.todos.slice(0, +per_page)
    res.status(200).json({
        data : data.todos.length,
        mama: arrSlice});
});

// Add new Todo with POST
app.post('/api/v1/todos',(req,res)=>{
    data.todos.unshift(req.body);
    fs.writeFileSync('db.json',JSON.stringify(data));
    res.status(201).json({
        message : "Add sucess",
        mama : data.todos
    })
});

// changecompleted with patch
app.patch('/api/v1/todos/:id',(req,res)=>{
    const index = data.todos.findIndex((item)=>item.id == req.params.id);
    data.todos[index].completed = !req.body.completed;
    fs.writeFileSync('db.json',JSON.stringify(data));
    res.status(200).json({
        mama : data.todos
    })
})
// update with put method
    app.put('/api/v1/todos/:id',(req,res)=>{
    const index = data.todos.findIndex((some)=>some.id == req.params.id);
    data.todos[index] = req.body
    fs.writeFileSync('db.json',JSON.stringify(data));
    res.status(200).json({
        message : "update  sucess",
        mama : data.todos
    })
});

//delete with delete method
app.delete('/api/v1/todos/:id',(req,res)=>{
    const newArr = data.todos.filter((item)=>item.id != req.params.id);
    data.todos = newArr;
    fs.writeFileSync('db.json',JSON.stringify(data));
    res.status(200).json({
        message  : "Del sucess",
        mama : data.todos
    })
})
// clear all
app.delete('/api/v1/todos',(req,res)=>{
    data.todos = [];
    fs.writeFileSync('db.json',JSON.stringify(data));
    res.status(200).json({
        mama:data.todos
    })
})

app.listen(PORT,()=>{
    console.log(` Server is running to http://localhost:${PORT}`)          
})
