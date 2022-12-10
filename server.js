require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const mongoString = process.env.DATABASE_URL
const router = require('./routes/routes')
const articleModel = require('./Model/article')
const methodOverride = require('method-override')
const app = express()

mongoose.connect(mongoString)
const db = mongoose.connection
// mongoose.set('strictQuery', false)
mongoose.set('strictQuery', true)

db.on('error',(error)=>{
    console.log(error);
})

db.once('connected',(connected)=>{
    console.log('Database connected');
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))
app.use('/articles',router)

app.get('/',async (req,res)=>{
const articles = await articleModel.find().sort({createdAt: 'desc'})
res.render('articles/index',  {articles: articles})
})

app.listen(5000,()=>{
    console.log('Server is running')
})