var express = require('express')
var app = express()
var bodyParser = require("body-parser")
var sayp = require('say-promise')
var request = require('request')
var cheerio = require('cheerio')

var url = process.argv[2]
// console.log('url', url)

var PORT = process.env.PORT || 3000

app.use(express.static("public"))
app.use(bodyParser.urlencoded({
  extended: false
}))

//Handlebars
var exphbs = require("express-handlebars")

app.engine("handlebars", exphbs({
  defaultLayout: "main"
}))
app.set("view engine", "handlebars")

//Routes
app.get('/', function(req, res) {

  var sentences=''
  var sentenceArray = []
  var title=''
  request(url, function (error, response, html) {

    var $ = cheerio.load(html)
    title = $('.graf--title').text()
    console.log('title', title);
    $('.sectionLayout--insetColumn').each(function(i, item) {
      var sentence = $(this).children('p').text()
      if(sentence) {
        sentence = sentence.replace(':', ", ")
        sentences+=sentence
        sentenceArray = sentences.split('.')
      }
    })

    var count = 0
    var narrate = function() {
      //if the text has come to the end, read the ending credits
      if(count == sentenceArray.length-1) {
        sayp.speak('The. END. Finito', 'Alex', 1.3)
        .then(function() {
          setTimeout( sayp.speak('Hope you enjoyed this narration. Brought to you by Narrator Me and Alfonso. tech', 'Samantha', 1.1), 5700 )
        })
      } else {
        if(count<sentenceArray.length) {

          if(count%3) {
            sayp.speak(sentenceArray[count], 'Alex', 1.3)
            .then(function() {
              count++
              setTimeout(narrate, 800)
            })
          } else {
            sayp.speak(sentenceArray[count], 'Samantha', 1.1)
            .then(function() {
              count++
              setTimeout(narrate, 750)
            })
          }
        }
      }
    }
    narrate()

    const hbsObject = {
      title: title,
      sentences: sentences,
      url: url
    }

    return res.render("index", hbsObject);
    // res.send('<h1 style="text-align:center">You are currently listening to this article: <a href="' + url + '" target="_blank">'+url+'</a><br><br> Happy Listening!</h1><br><br>'+ sentences)
  })
})

app.listen(PORT, function() {
  console.log('Listening on port: ', PORT)
})

module.exports = app
