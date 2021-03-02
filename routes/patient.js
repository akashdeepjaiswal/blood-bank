var express = require("express");
var router = express.Router();
const bcrypt = require('bcrypt');
var connection = require("../sql_conn");

var patient_details;
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("patient/signup_login_form");
});

router.post("/signup", async function (req, res) {
  console.log(req.body);
  const name = req.body.name;
  const contact = req.body.contact;
  const bloodtype = req.body.bloodtype;
  const email = req.body.email;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const password = hashedPassword;

  var formOutputPatient = [
    name,
    email,
    password,
    contact,
    bloodtype,
  ];

  connection.query(
    "INSERT INTO patient_data (name,email,password,contact,blood_group) values (?)",
    [formOutputPatient],
    function (err, result) {
      if (err) throw err;

      // if(err.errno ==1062)
      // {
      //   document.getElementsByTagName(".alert strong").innerText = "Login Failed: This Email already exists.Please try with different Email.";

      //   // Access Denied! Please provide valid authorization.
      //   // SignUp Successful:Thank you for your registration.

      //   console.log("111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111");
      //   console.log("error issssss      ",err);
      //   console.log("error issssss      ",err.errno," ------ ",err.code);
      // }
      console.log("The result is from signup: ", result);
    }
  );

  // res.redirect("/");
  res.send("SignUp Successful");
});

router.post("/signin",function (req, res) {
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;

  // "SELECT COUNT (*) FROM patient_data WHERE email=? password=? ",
  connection.query(
    "SELECT * FROM patient_data WHERE email=? ",
    // "SELECT count(*) as rows FROM patient_data WHERE email=? and password=? ",
    [email],
    async function (err, result, feilds) {
      if (err) throw err;
      // if (err) {
      //   //we make sure theres an error (error obj)
      //   if (err.errno == 1062) {
      //     return res.redirect("/patient");
      //     // db.end();
      //   } else {
      //     throw err;
      //     // db.end();
      //   }
      // }
      else {
        console.log("result:::: ", result);
        if (result.length > 0 && (await bcrypt.compare(req.body.password, result[0].password))) {
          console.log("patient_details result[0]:::: ", result[0]);
          console.log(" Result is not null");
          patient_details = result[0];

          res.render("patient/patient_dashboard", patient_details);
        } else {
          console.log("result is null");
          res.send("Login failed");
        }
      }
    }
  );
});

//available vlood
router.get("/patient-dashboard", function (req, res, next) {
  res.render("patient/patient_dashboard", patient_details);
});

router.post("/patient-dashboard", function (req, res) {
  res.send("post request yet not defined");
});

var obj = {};

router.get("/available-blood", function (req, res, next) {
  // console.log("patient available blood:  ",req.body);
  var query =
    "SELECT id, hospital_id, a_positive, a_negative, b_positive, b_negative, ab_positive, ab_negative, o_positive, o_negative FROM blood_bank";

  connection.query(query, function (err, result) {
    if (err) {
      throw err;
    } else {
      // result= array of objects
      console.log("result::  ", result);
      obj = { blood_details: result, pat_id: patient_details.id };
      res.render("patient/available_blood", obj);
      obj = {};
    }
  });
});

router.post("/available-blood", function (req, res) {
  console.log(req.body);

  const blood_type = req.body.bloodtype;
  const unit = req.body.unit_requested;
  const hosp_id = req.body.hosp_id;
  const pat_id = req.body.pat_id;
  var formOutputPatient = [pat_id, hosp_id, blood_type, unit];

//check for invalid entrys
  var query =
    "insert into blood_requests (patient_id,hospital_id,blood_type,quantity) values (?)";
  connection.query(
    query, 
    [formOutputPatient], 
    function (err, result, feilds) {
    if (err) throw err;
    else {
      //request sent 
// res.redirect('/p');
      console.log("data inserted in blood_requests----resulr:----- ",result);
    }
  });
});

module.exports = router;
