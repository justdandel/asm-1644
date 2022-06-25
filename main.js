var express = require('express')
var app = express()
var mongodb = require('mongodb');
app.set('view engine', 'hbs')
app.use(express.urlencoded({
    extended: true
}))

var MongoClient = require('mongodb').MongoClient
var url = 'mongodb+srv://just_dandel:3whsjzj0812@cluster0.4wd7g.mongodb.net/test'

app.get('/', async(req, res) => {
    let server = await MongoClient.connect(url)
    let dbo = server.db("BTNToys")
    let products = await dbo.collection('products').find().toArray()

    res.render('home', {
        'products': products,
    })
})

app.get('/delete/:id', async(req, res) => {
    let server = await MongoClient.connect(url)
    let dbo = server.db("BTNToys")
    await dbo.collection('products').deleteOne({
        _id: mongodb.ObjectId(req.params.id)
    })

    res.redirect('/')
})

app.post('/newProduct', async(req, res) => {
    let name = req.body.txtName
    let price = req.body.txtPrice
    let picture = req.body.txtPicture
    if (name.length <= 5) {
        res.render('newProduct', {
            'nameError': 'Ten phai dai hon 5 ki tu'
        })
        return
    }
    let product = {
        'name': name,
        'price': price,
        'img': picture
    }
    let server = await MongoClient.connect(url)
    let dbo = server.db("BTNToys")
    await dbo.collection('products').insertOne(product)
    res.redirect('/')
})

app.get('/insert', (req, res) => {
    res.render('newProduct')
})


const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log('server is running')