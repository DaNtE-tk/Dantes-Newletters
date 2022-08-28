const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https")

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req,res){
  res.sendFile(__dirname+'/signup.html');
});

app.post('/', function (req,res){
  const fName = req.body.fname;
  const lName = req.body.lname;
  const email = req.body.mail;

  var data = {
    members : [
      {
        email_address: email,
        status: "subscribed",
        merge_fields:{
          FNAME: fName,
          LNAME: lName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = 'https://us13.api.mailchimp.com/3.0/lists/f64f2a5c16';

  const options = {
    method: 'POST',
    auth: 'Dante:1e1f4f82a54f39df61a8b3d47445afd8-us13'
  }

  const request = https.request(url, options, function(response){
    statusCode = response.statusCode;
    if(response.statusCode == 200){
        // res.write(statusCode+"\nEverything seems ok!");
        res.sendFile(__dirname+'/success.html');
    }
    else{
      // res.write(statusCode+"\nSomething went wrong!\nGo back and try again.");
      res.sendFile(__dirname+'/failure.html');
    }


    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();


  // console.log(fName+"\n"+lName+"\n"+email);
});

app.post('/failure', function(req, res){
  res.redirect('/');
});




app.listen(process.env.PORT || 3000, function(){
  console.log("Server Initialized at port:3000");
});





//MailChimp API KEY
// 373f4edf5434b1769fba166a9c43155d-us13

// Audience ID
// f64f2a5c16
