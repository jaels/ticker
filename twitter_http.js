var fs = require('fs');
var express = require('express');
var app = express();

var api = require('./twitterAPI.js');

var hb = require('express-handlebars');
app.engine('handlebars', hb());
app.set('view engine', 'handlebars');

var code;
var autho;
var sources;


var read = fs.readFileSync('./tweets.JSON');
code = JSON.parse(read.toString());
autho = new Buffer(code.consumerKey + ':' + code.consumerSecret).toString('base64');


app.use(express.static(__dirname + '/public'));


app.get('/ticker', function (req,res) {

    var toGet = api.getToken(autho);

    toGet.then(function(token){
        var final=[];
        sources = ['theonion','guardian','huffingtonpost'];
        for (var k=0;k<sources.length;k++) {
            var current = sources[k];
            final.push(api.getTweets(current,token));
        }
        return Promise.all(final);

    }).then(function(final) {
        final = final.reduce(function(a, b){
            return a.concat(b);
        });

        console.log('final before sorting ' + final)
        final.sort(function(a,b) {
            return new Date(b.time).getTime() - new Date(a.time).getTime();
        });

        res.render('ticker', {
            final:final
        });

    });
});



app.listen(8080);
