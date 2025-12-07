// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection

mongoose.connect(process.env.MONGO)
  .then(() => console.log("DB connected"))
  .catch(err => {
    console.log("DB ERROR:", err.message);
  });

// Todo model
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  done: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const Todo = mongoose.model('Todo', todoSchema);

// Routes
app.get('/todos', async (req,res)=> {
  const todos = await Todo.find().sort({createdAt:-1});
  res.json(todos);
});

app.post('/todos', async (req,res)=>{
  const { title } = req.body;
  if(!title) return res.status(400).json({error:'title required'});
  const todo = await Todo.create({title});
  res.status(201).json(todo);
});

app.put('/todos/:id', async (req,res)=>{
  const { id } = req.params;
  const updates = req.body; // e.g. { title, done }
  const todo = await Todo.findByIdAndUpdate(id, updates, {new:true});
  if(!todo) return res.status(404).json({error:'not found'});
  res.json(todo);
});

app.delete('/todos/:id', async (req,res)=>{
  const { id } = req.params;
  const todo = await Todo.findByIdAndDelete(id);
  if(!todo) return res.status(404).json({error:'not found'});
  res.json({success:true});
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log(`Server ${PORT}`));
