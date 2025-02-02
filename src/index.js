const express = require("express")
const path = require("path")
const app = express()
const hbs = require("hbs")
const collection = require("./mongodb.js")
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const tempelatePath = path.join(__dirname, '../tempelates')
const publicPath = path.join(__dirname, '../public')
console.log(publicPath);

app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.static(publicPath))


// hbs.registerPartials(partialPath)
app.get('/', (req, res) => {
    res.render('Home')
})

app.get('/Signup', (req, res) => {
    res.render('Signup')
})
app.get('/Login', (req, res) => {
    res.render('Login')
})
app.get('/TextTranslator',(req,res)=>{
    res.render("TextTranslator")
})
app.get('/languages',(req,res)=>{
    res.render("languages")
})
app.get('/location',(req,res)=>{
    res.render("location")
})
app.get('/Vice-versa',(req,res)=>{
    res.render("Vice-versa")
})
app.get('/Speech_text',(req,res)=>{
    res.render("Speech_text")
})
app.get('/Real-time-translator',(req,res)=>{
    res.render("Real-time-translator")
})
app.post('/Signup', async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password
    }
    await collection.insertMany([data])
    res.render("Home")
})

//     const checking = await collection.findOne({ name: req.body.name })

//    try{
//     if (checking.name === req.body.name && checking.password===req.body.password) {
//         res.send("user details already exists")
//     }
//     else{
//         await collection.insertMany([data])
//     }
//    }
//    catch{
//     res.send("wrong inputs")
//    }

//     res.status(201).render("home", {
//         naming: req.body.name
//     })
// })


app.post('/login', async (req, res) => {

    try {
        const check = await collection.findOne({ name: req.body.name })

        if (check.password === req.body.password) {
            res.render("home")
        }

        else {
            res.send("incorrect password")
        }


    } 
    
    catch (e) {

        res.send("wrong details")
        

    }


})



app.listen(3000, () => {
    console.log('port connected');
});