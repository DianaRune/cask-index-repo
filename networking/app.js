//Required libraries and definitions
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const app = express();
const fs = require('fs');
const { promisify } = require('util');
let PORT = process.env.PORT || 3000;

require.extensions['.html'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};
var data = require('D:/Documents/Portfolio to Steve/CASK INDEX/templates/emailTemplate.html'); // path to your HTML template

app.get('/', (req, res) => {
  console.log('Request for contact page recieved');
  res.render('contact');
});

// Body Parser Middleware
var urlencodedParser = bodyParser.urlencoded({extended:false})
// Express body getaround
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + "/views");

//Allow rejection of certificate requirement.
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 1;

//Defined field
var recipient = "";

//Attempt postage from sumbmission
app.post('/send', urlencodedParser, function(req, res){
    recipient = req.body.email;
    console.log(recipient);
    function replacePersonals() {///////////////////////////////////////////////////////////////////////////////////////////////////////
      let str = document.getElementById("emailPersonal").innerHTML;///////////////////////////////////////////////////////////////////////////////////////////////////////
      document.getElementById("emailPersonal").innerHTML = str.replace("[your name]", recipient);///////////////////////////////////////////////////////////////////////////////////////////////////////
    }//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    res.render('contact');// MAINTAINS THE CASK PAGE

// create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "dianarune20@gmail.com", // generated ethereal user
        pass: "1Ring2RuleThem@ll", // generated ethereal password
      },
    host: "smtp.gmail.com",
    port: 465, //25
    secure: true, // true for 465, false for other ports
    //Connection: 'keep-alive',
    tls: {
        rejectUnauthorized: false,
    },
    requestCert: true,  
    agent: false
  });

  // send mail with defined transport object
  let mailOptions = {
    from: '"CyburDog" <dianarune20@gmail.com>', // sender address
    to: recipient, // list of receivers
    subject: "Yo yo!", // Subject line
    //text: "Hello world!", // plain text body
    html: data,
  };

  transporter.sendMail(mailOptions, (error) => {
      if(error) {
        return console.log(error);
      }
      else
      {
        replacePersonals();////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        console.log(document.getElementById("emailPersonal").innerHTML);
        console.log("Email sent.");
      }
    //res.render('contact', {msg:'Email has been sent'});
});
});

app.listen(PORT, () => console.log('Server started...'));