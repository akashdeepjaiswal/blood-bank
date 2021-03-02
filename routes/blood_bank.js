var express = require("express");
var router = express.Router();
var connection = require("../sql_conn");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("blood-bank/bloodbank_info");
});

router.post("/signup", function (req, res) {
  console.log(req.body);
  const name = req.body.name;
  const contact = req.body.contact;
  const bloodtype = req.body.bloodtype;
  const email = req.body.email;
  const password = req.body.password;
  var formOutputPatient = [
    req.body.name,
    req.body.email,
    req.body.password,
    req.body.contact,
    req.body.bloodtype,
  ];

  connection.query(
    "INSERT INTO patient_data (name,email,password,contact,blood_group) values (?)",
    [formOutputPatient],

    function (err, result) {
      if (err) throw err;
      console.log("The result is: ", result);
    }
  );

  // res.redirect("/");
  res.send("SignUp Successful");
});

router.post("/signin", function (req, res) {
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  var formOutputPatient = [req.body.email, req.body.password];

  // "SELECT COUNT (*) FROM patient_data WHERE email=? password=? ",

  connection.query(
    // "SELECT * FROM patient_data WHERE email=? and password=? ",
    "SELECT count(*) as rows FROM patient_data WHERE email=? and password=? ",
    [email, password],
    function (err, result,feilds) {
      if (err) throw err;
      else {
        var rowCount=result[0].rows;
        console.log("The result isssss: ", rowCount);
        // console.log("Number of rows affected : " + result.affectedRows);
        // console.log("Number of records affected with warning : " + result.warningCount);
        // console.log("Message from MySQL Server : " + result.message);
        // console.log("The feilds isssss: ", feilds);
        if (rowCount == 0) {
          // res.write("You are not regidtered yet. Please Register");
          res.redirect("/patient");
          // res.end();
        } else {
          res.send("Login Successful");
        }
      }
    }
  );

});

//availbe blood api open to all but only patient can request only when logined in
router.get("/available-blood", function (req, res, next) {
    res.render("patient/available_blood");
  });
  
  router.post("/signup", function (req, res) {
    // console.log(req.body);
    res.send("post not define yet in blood bank.js")
  });

  
module.exports = router;
