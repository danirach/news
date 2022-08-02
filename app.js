const express = require("express");
const bodyParser = require("body-parser");
const https = require('https');
const request = require('request');

const app = express()
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}));

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html")
});

app.post("/", (req, res) => {
  const firstName = req.body.first
  const lastName = req.body.last
  const email = req.body.email

  const data = {
    members:[
        {
            email_address: email,
            status: "subscribed",
            merge_fields:{
                FNAME: firstName,
                LNAME: lastName
            }
        }
    ]
  }
  const jsonData = JSON.stringify(data)  

  const options = {
    method: "POST",
    auth: "doni:d561d75d94f7164c7b931d12c54b70cc-us17"
  }

  const url = "https://us17.api.mailchimp.com/3.0/lists/ac7506734b"
  const request = https.request(url, options, (response)=>{
    if (response.statusCode === 200) {
      res.sendFile(__dirname+"/success.html")
    } else {
      res.sendFile(__dirname +"/failure.html")
    }
    response.on("data",(data)=>{
        console.log(JSON.parse(data))
    })
  })

  request.write(jsonData)
  request.end()

});

// audience id

app.listen(port, () => console.log(`Server running on port ${port}`));