var express = require('express');
var router = express.Router();
var connection= require("../sql_conn");

/* GET users listing. */
// router.get('/blood-info', function(req, res, next) {
//   // res.render('hospital/blood_info');
//   res.send("working");
// // res.send("working");
// });

router.post("/blood-info", function (req, res) {
    console.log(req.body);
    // const name = req.body.name;
    // const unit = req.body.unit;
    // var formOutputPatient = [
    //   req.body.name,
    //   req.body.contact,
    //   req.body.email,
    //   req.body.password
    // ];
  
    // connection.query(
    //   "INSERT INTO hospital_data (name,contact,email,password) values (?)",
    //   [formOutputPatient],
    //   function (err, result) {
    //     if (err) throw err;
    //     console.log("The result is: ", result);
    //   }
    // );
  
    // res.redirect("/");
    res.send("Blood added Successful");
  });
  
  router.post("/signin", function (req, res) {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    var formOutputPatient = [req.body.email, req.body.password];
  
    // "SELECT COUNT (*) FROM patient_data WHERE email=? password=? ",
  
    connection.query(
      // "SELECT * FROM patient_data WHERE email=? and password=? ",
      "SELECT count(*) as rows FROM hospital_data WHERE email=? and password=? ",
      [email, password],
      function (err, result,feilds) {
        if (err) throw err;
        else {
          var rowCount=result[0].rows;
          console.log("The result isssss: ", result[0]);
          console.log("The result isssss: ", rowCount);

          if (rowCount == 0) {
            // res.write("You are not regidtered yet. Please Register");
            res.redirect("/hospital");
            // res.end();
          } else {
            res.send("Login Successful");
          }
        }
      }
    );
  
  });

module.exports = router;
