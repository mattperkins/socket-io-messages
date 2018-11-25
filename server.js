const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const mongoose = require('mongoose')

// Middleware
app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const dbUrl = 'mongodb://test:test1234@ds115874.mlab.com:15874/socket-io-messages'

const Message = mongoose.model('Message', {
  name: String,
  message: String
})

app.get('/messages', (req, res) => {
  Message.find({}, (err, messages) => {
    if (err)
      sendStatus(500)

    res.send(messages)
  })
})

app.post('/messages', (req, res) => {
  // console.log(req.body)
  var message = new Message(req.body)
  message.save((err) => {
    if (err)
      sendStatus(500)

    io.emit('message', req.body)
    res.sendStatus(200)
  })
})

io.on('connection', (socket) => {
  console.log('A User Connected!')
})

mongoose.connect(dbUrl, { useNewUrlParser: true }, (err) => {
  console.log('mongoDb connection', err)
})

const server = http.listen(3002, () => {
  console.log('Server listening on port', server.address().port)
})