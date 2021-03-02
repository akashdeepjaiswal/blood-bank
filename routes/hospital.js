var express = require("express");
var router = express.Router();
var connection = require("../sql_conn");
const bcrypt = require('bcrypt');

var hospital_details;
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("hospital/signup_login_form");
});

router.post("/signup", async function (req, res) {
  console.log(req.body);
  const name = req.body.name;
  const contact = req.body.contact;
  const email = req.body.email;

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const password = hashedPassword;

  var formOutputPatient = [
    name,
    contact,
    email,
    password,
  ];

  connection.query(
    "INSERT INTO hospital_data (name,contact,email,password) values (?)",
    [formOutputPatient],
    function (err, result) {
      if (err) throw err;
      console.log("The result is from signup: ", result);
    }
  );

  // res.redirect("/");
  res.send("SignUp Successful");
});

router.post("/signin", function (req, res) {
  console.log(req.body);
  
  const email = req.body.email;
  const password = req.body.password;
  var formOutputHospital = [email];
  // console.log("hashedpass: ", hashedPassword);
  // var sql=
  connection.query(
    "SELECT * FROM hospital_data WHERE email=?",
    formOutputHospital,
    async function (err, result, fields) {
      if (err) throw err;
      else {
        // var rowCount=result[0].rows;
        // console.log("The result isssss: ", rowCount);
        console.log("result:::: from signin : ", result);
        if (result.length > 0 && (await bcrypt.compare(req.body.password, result[0].password))) {
          console.log(" Result is not null");

          hospital_details = result[0];
          // console.log("hospital_details: ",hospital_details);
          // res.render("hospital/hospital_dashboard",{"alertMessage": "this is alert message"});
          res.render("hospital/hospital_dashboard", hospital_details);
        } else {
          console.log("result is null");
          res.send("Login failed");
        }
      }
    }
  );
});

// hospital dashboad
router.get("/hospital-dashboard", function (req, res, next) {
  res.render("hospital/hospital_dashboard", hospital_details);
});

router.post("/hospital-dashboard", function (req, res) {
  res.send("post request yet not defined");
});

/* GET add-blood listing. */
router.get("/add-blood", function (req, res, next) {
  res.render("hospital/add_blood");
  //   res.send("working");
});

router.post("/add-blood", function (req, res) {
  console.log(req.body);
  const blood_type = req.body.bloodtype;
  const unit = req.body.unit;
  var formOutputPatient = [blood_type, unit];

  //id is getting passed
  console.log("hosptal details", hospital_details);

  connection.query(
    "SELECT * FROM blood_bank where hospital_id=" + hospital_details.id,
    // "SELECT count(*) as rows FROM hospital_data WHERE email=? and password=? ",
    function (err, result, fields) {
      if (err) throw err;
      else {
        // var rowCount=result[0].rows;
        // console.log("The result isssss: ", rowCount);
        console.log("result:::: ", result);
        if (result.length > 0) {
          var query =
            "UPDATE blood_bank SET " +
            blood_type +
            "=" +
            blood_type +
            " +" +
            unit +
            " WHERE hospital_id = " +
            hospital_details.id;
          //Main query
          connection.query(
            query,
            // "INSERT INTO hospital_data (name,contact,email,password) values (?)",
            [formOutputPatient],
            function (err, result, fields) {
              if (err) throw err;
              else {
                console.log("Blood Added");
              }
            }
          );
        } else {
          var query =
            "insert into blood_bank (hospital_id) values (" +
            hospital_details.id +
            ")";
          connection.query(query, function (err, result, fields) {
            if (err) throw err;
            else {
              query =
                "UPDATE blood_bank SET " +
                blood_type +
                "=" +
                blood_type +
                " +" +
                unit +
                " WHERE hospital_id = " +
                hospital_details.id;
              //Main query
              connection.query(
                query,
                // "INSERT INTO hospital_data (name,contact,email,password) values (?)",
                [formOutputPatient],
                function (err, result, fields) {
                  if (err) throw err;
                  else {
                    console.log("Blood Added");
                    res.send("Successfully Added blood");
                  }
                }
              );
            }
          });
        }
      }
    }
  );
});

//view blood info of hospital
router.get("/view-blood-info", function (req, res, next) {
  var obj = {};
  const sqlQuery = "SELECT * FROM blood_bank where hospital_id=" + hospital_details.id;
  //  + " where a_positive IS NOT 0 AND a_negative IS NOT 0 AND b_positive IS NOT 0 AND b_negative IS NOT 0 AND ab_positive IS NOT 0  AND ab_negative IS NOT 0  AND o_positive IS NOT 0  AND o_negative IS NOT 0";
  console.log('sqlQuery: ',sqlQuery);
  connection.query(sqlQuery
    ,
    function (err, result) {
      if (err) {
        throw err;
      } else {
        obj = { blood_details: result };
        console.log("result::  ", result);
        console.log("obj::  ", obj);
        res.render("hospital/blood_info", obj);
        obj = {};
      }
    }
  );
  //   res.send("working");
});

router.post("/view-blood-info", function (req, res) {});


//view request
router.get("/requests", function (req, res, next) {
  var obj = {};
  var query = "SELECT * FROM blood_requests where hospital_id="+hospital_details.id+" ORDER BY time DESC" ;
  connection.query(query, function (err, result) {
    if (err) {
      throw err;
    } else {
      // result= array of objects
      // console.log("request detail  result::  ", result);
      obj = { request_details: result};
      res.render("hospital/requests", obj);
      obj = {};
    }
  });

});


router.post("/requests", function (req, res) {

console.log("requests ", req.body);
const request_id=req.body.request_id;

var query="SELECT * FROM blood_requests where id=" + request_id;
connection.query(
  query,
  function (err, result, fields) {
    if (err) throw err;
    else {
      
      console.log("result: ", result);

      if (result.length > 0 ) {
        var query =
          "UPDATE blood_requests SET approved = 'Y'"  +
          " WHERE id = " +
          request_id;

        connection.query(
          query,
          function (err, result, fields) {
            if (err) throw err;
            else {
              console.log("result after updating the status of request ", result);
              res.redirect("/hospital/requests");
            }
          }
        );
      } else {
        res.send("invalid request.")
      }
    }
  }
);

});



//approved-requests
router.get("/approved-request", function (req, res, next) {
  res.render("hospital/approved_request",);
});

router.post("/approved-request", function (req, res) {
  res.send("post request yet not defined");
});

router.get("/rejected-request", function (req, res, next) {
  res.render("hospital/rejected_request", hospital_details);
});

router.post("/rejected-request", function (req, res) {
  res.send("post request yet not defined");
});



module.exports = router;
