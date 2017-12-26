var express = require('express')
var app = express()
var sayp = require('say-promise')
var request = require('request')
var cheerio = require('cheerio')

var url = process.argv[2]
console.log('url', url)

var PORT = 3000

app.get('/', function(req, res) {

  var sentences=''
  var sentenceArray = []
  request(url, function (error, response, html) {

    var $ = cheerio.load(html)
    $('.sectionLayout--insetColumn').each(function(i, item) {
      var sentence = $(this).children('p').text()
      if(sentence) {
        sentence = sentence
        sentences+=sentence
        sentenceArray = sentences.split('.')
      }
    })

    var count = 0
    var narrate = function() {
      if(count<sentenceArray.length) {

          if(count%3) {
            sayp.speak(sentenceArray[count], 'Alex', 1.4)
            .then(function() {
              count++
              setTimeout(narrate, 800)
            })
          } else {
            sayp.speak(sentenceArray[count], 'Vicki', 1.3)
            .then(function() {
              count++
              setTimeout(narrate, 750)
            })
          }

      }
    }
    narrate()
    res.send('<h1 style="text-align:center">You are currently listening to this article: <a href="' + url + '" target="_blank">'+url+'</a><br><br> Happy Listening!</h1><br><br>'+ sentences)
  })
})

app.listen(PORT, function() {
  console.log('Listening on port: ', PORT)
})

module.exports = app
