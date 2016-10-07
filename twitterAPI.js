
var https = require('https');

var tweets;
var obj;
var oneSource=[];



exports.getToken = function (autho) {


    return new Promise(function(resolve, reject) {

        var options = {
            hostname: 'api.twitter.com',
            method: 'POST',
            path: '/oauth2/token',
            headers: {
                'Authorization': 'Basic ' + autho,
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }

        };

        var req = https.request(options, function(res) {
            var str = '';
            res.on('data', function (chunk) {
                str += chunk;
            });

            res.on('end', function () {
                var token = JSON.parse(str).access_token;
                resolve(token);


            });


        });


        req.write('grant_type=client_credentials');
        req.end();
        req.on('error', (e) => {
            reject(e);
        });



    });

};


exports.getTweets = function (current,token) {

    return new Promise(function(resolve, reject) {
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
                var arr=[];

                for (var i=0;i<10;i++)
                {
                    for (var prop in tweets[i]){
                        if(prop==="text") {
                            arr.push(tweets[i][prop] + "*" + tweets[i]['created_at']);
                        }

                    }

                }

                var newArr =  arr.filter(function(x) {
                    return ((x[0]+x[1]!=='RT') && (x.split('https').length===2));
                });

                for (var j=0;j<newArr.length;j++) {
                    obj={};
                    obj.text=newArr[j].slice(0,20) + '...' + '(' + current + ')';

                    obj.link=newArr[j].slice(newArr[j].indexOf('https'),newArr[j].lastIndexOf("*"));

                    obj.time=newArr[j].slice(newArr[j].indexOf('*'));

                    oneSource.push(obj);

                }
                resolve(oneSource);

            });
        });
        req.end();
        req.on('error', (e) => {
            reject(e);
        });

    });

};
