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

mongoose.Promise = Promise

const dbUrl = 'mongodb://test:test1234@ds115874.mlab.com:15874/socket-io-messages'

const Message = mongoose.model('Message', {
  name: String,
  message: String
})

app.get('/messages', (req, res) => {
  Message.find({}, (err, messages) => {
    if (err) res.sendStatus(500)

    res.send(messages)
  })
})

app.post('/messages', (req, res) => {
  // console.log(req.body)
  var message = new Message(req.body)

  message.save()
    .then(() => {
      console.log('saved')
      return Message.findOne({ message: 'censored' })
    })
    .then(censored => {
      if (censored) {
        console.log('Censored word found', censored)
        return Message.deleteOne({ _id: censored.id })
      }
      io.emit('message', req.body)
      res.sendStatus(200)
    })
    .catch((err) => {
      return console.log(err)
    })
})

// socket io
io.on('connection', (socket) => {
  console.log('A User Connected!')
})

// mongo db
mongoose.connect(dbUrl, { useNewUrlParser: true }, (err) => {
  console.log('mongoDb connection', err)
})

// node-http server
const server = http.listen(3002, () => {
  console.log('Server listening on port', server.address().port)
})
