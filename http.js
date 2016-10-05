
var https = require('https');
var fs = require('fs');
var express = require('express');
var app = express();

var hb = require('express-handlebars');
app.engine('handlebars', hb());
app.set('view engine', 'handlebars');

var code;
var token;
var tweets;
var obj;
var autho;


var read = fs.readFileSync('./tweets.JSON');
console.log(read);
code = JSON.parse(read.toString());
console.log(code);
autho = new Buffer(code.consumerKey + ':' + code.consumerSecret).toString('base64');







app.use(express.static(__dirname + '/public'));


app.get('/ticker', function (req,res) {



    var options = {
        hostname: 'api.twitter.com',
        method: 'POST',
        path: '/oauth2/token',
        headers: {
            'Authorization': 'Basic ' + autho,
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }

    };

    req = https.request(options, function(res) {
        var str = '';
        res.on('data', function (chunk) {
            str += chunk;
        });

        res.on('end', function () {
            token = JSON.parse(str).access_token;
            console.log(token);
            getTweets();

        });


    });


    req.write('grant_type=client_credentials');
    req.end();



    function getTweets() {
        var options = {
            hostname: 'api.twitter.com',
            method: 'GET',
            path: '/1.1/statuses/user_timeline.json?count=100&screen_name=theonion',
            headers: {
                'Authorization': 'Bearer ' + token
            }

        };

        var req = https.request(options, function(tres) {
            var str = '';
            tres.on('data', function (chunk) {
                str += chunk;
            });

            tres.on('end', function () {
                tweets=JSON.parse(str);

                var arr=[];

                for (var i=0;i<20;i++)
                {
                    for (var prop in tweets[i]){
                        if(prop==="text") {
                            arr.push(tweets[i][prop]);
                        }

                    }

                }
                var newArr =  arr.filter(function(x) {
                    return ((x[0]+x[1]!=='RT') && (x.split('https').length===2));
                });



                var final=[];
                for (var i=0;i<newArr.length;i++) {
                    obj={};
                    obj.text=newArr[i].slice(0,newArr[i].indexOf('https')) + '...';
                    obj.link=newArr[i].slice(newArr[i].indexOf('https'),newArr[i].lastIndexOf("#"));
                    final.push(obj);
                }
                console.log(final);

                res.render('ticker', {
                    final:final

                });



            });

        });
        req.end();
        req.on('error', (e) => {
            console.error(e);
        });


    }


});



app.listen(8080);
