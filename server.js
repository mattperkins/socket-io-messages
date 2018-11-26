const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const mongoose = require('mongoose')

const badWords = require('./badWords')

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

app.post('/messages', async (req, res) => {
  // console.log(req.body)
  var message = new Message(req.body)
  // eslint-disable-next-line
  const savedMessage = await message.save()
  // console.log('saved', savedMessage)

  const censored = await Message.findOne({ message: badWords })
  if (censored) await Message.deleteOne({ _id: censored.id })
  else io.emit('message', req.body)
  res.sendStatus(200)
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
