
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
var sources;
var final=[];

var k;


var read = fs.readFileSync('./tweets.JSON');
code = JSON.parse(read.toString());
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
             sources = ['theonion','guardian','huffingtonpost'];

            for (var k=0;k<sources.length;k++) {
                var current = sources[k];
                getTweets(current);
            }

        });


    });


    req.write('grant_type=client_credentials');
    req.end();
    req.on('error', (e) => {
        console.error(e);
    });



    function getTweets(current) {
        var options = {
            hostname: 'api.twitter.com',
            method: 'GET',
            path: '/1.1/statuses/user_timeline.json?count=100&screen_name='+current,
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

                console.log(tweets);

                var arr=[];

                for (var i=0;i<10;i++)
                {
                    for (var prop in tweets[i]){
                        if(prop==="text") {
                            arr.push(tweets[i][prop] + "*" + tweets[i]['created_at']);
                        }

                    }

                }

                console.log(arr);
                var newArr =  arr.filter(function(x) {
                    return ((x[0]+x[1]!=='RT') && (x.split('https').length===2));
                });


                for (var j=0;j<newArr.length;j++) {
                    obj={};
                    // obj.text=newArr[i].slice(0,newArr[i].indexOf('https')) + '...' + '(' + current + ')';
                     obj.text=newArr[j].slice(0,20) + '...' + '(' + current + ')';

                    obj.link=newArr[j].slice(newArr[j].indexOf('https'),newArr[j].lastIndexOf("#"));

                    obj.time=newArr[j].slice(newArr[j].indexOf('*'));

                    final.push(obj);

                }

                final.sort(function(a,b) {
                    return new Date(b.time).getTime() - new Date(a.time).getTime(); 
                });


console.log(final);
console.log(current);

                if (current==='huffingtonpost') {
                    res.render('ticker', {
                        final:final
                });
                }

            });
        });

        req.end();
        req.on('error', (e) => {
            console.error(e);
        });


    }


});



app.listen(8080);
