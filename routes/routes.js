const express = require('express')
const articleModel = require('../Model/article')
const router = express.Router()

router.get('/new',(req,res)=>{
    res.render('articles/new', {article: new articleModel()})
})

router.get('/edit/:id', async (req,res)=>{
    const article = await articleModel.findById(req.params.id)
    res.render('articles/edit', {article: article})
})

router.get('/:slug',async (req,res)=>{
const articles = await articleModel.findOne({slug: req.params.slug})
if (articles === null){res.redirect('/')}
else 
{res.render('articles/show', {article: articles})}
})



router.post('/',async (req,res,next)=>{
   req.article = new articleModel()
    next()
},saveAndRedirect('new')) 

router.put('/:id',async(req,res,next)=>{
    req.article= await articleModel.findById(req.params.id)
    next()
},saveAndRedirect('edit'))

router.delete('/:id',async (req,res)=>{
await articleModel.findByIdAndDelete(req.params.id)
res.redirect('/')
})

function saveAndRedirect(path){
    return async (req,res)=>{
        let article = req.article;
            article.title =req.body.title;
            article.description = req.body.description;
            article.markdown = req.body.markdown;
        
        try {
            article=await article.save()
            res.redirect(`/articles/${article.slug}`)
        } catch (error) {
            res.render(`articles/${path}`, {article: article})
        } 
    }
}

module.exports=router