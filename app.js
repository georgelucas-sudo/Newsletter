//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser"); //requiring to use body parser
const { json } = require("body-parser");
//const request = require("req");   this line was changed  and it nolonger works

const https = require("https");
const { request } = require("http");


const app = express();

app.use(express.static("public")); //this code uses and generates  the static functions like the css, images and others
///then we move our css and images to the folder called public after creating it.
//so we have to create a folder called public and drug our files there and then put there location in html
app.use(bodyParser.urlencoded({ extended: true })); //asking the app to use bodyparser

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/Signup.html")

});
app.post("/", function(req, res) {
    const firstname = req.body.fname;
    const secondname = req.body.lname;
    const email = req.body.email;

    console.log(firstname, secondname, email)


    var data = {

        members: [

            {
                email_address: email,
                status: "subscribed",
                merge_fields: {

                    FNAME: firstname,
                    LNAME: secondname
                }

            }
        ]


    }
    const jsonData = JSON.stringify(data); //here we convert the data into json     

    const url = "https://us14.api.mailchimp.com/3.0/lists/cc7a453682"
    const options = {
        method: "POST",
        auth: "georgedalucas:283a8546599022d6107907a942a0bf34-us14"


    }

    const request = https.request(url, options, function(response) {
        if (response.statusCode === 200) {;
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

})

app.post("/failure", function(req, res) {
    res.redirect("/") //for redirecting people who have failed to sign up 
})

app.listen(process.env.PORT || 3000, function(req, res) { // THIS LINE ENABLES U TO USE THE APP ON HEROKU AND ON THE LOCAL MACHINE
        // for any errors u check heroku logs and u change them then post them "git push heroku master after git add . "
        // git commit -m "message name"
        console.log("Server 3000 is up and running")
    }) //API KEY
    //283a8546599022d6107907a942a0bf34-us14

//https://us14.admin.mailchimp.com/lists/settings?id=553743
//lists  '{"name":"","contact":{"company":"","address1":"","address2":"","city":"","state":"","zip":"","country":"","phone":""},"permission_reminder":"","use_archive_bar":false,"campaign_defaults":{"from_name":"","from_email":"","subject":"","language":""},"notify_on_subscribe":"","notify_on_unsubscribe":"","email_type_option":false,"double_optin":false,"marketing_permissions":false}'
//audience key tourism 
//cc7a453682