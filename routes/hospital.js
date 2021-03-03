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

  var formOutputHospital = [
    name,
    contact,
    email,
    password,
  ];

  connection.query(
    "INSERT INTO hospital_data (name,contact,email,password) values (?)",
    [formOutputHospital],
    function (err, result) {
      if (err) throw err;
      else{
        res.render("handle_message", { message: "SignUp Successful" });
      }
    }
  );


});

router.post("/signin", function (req, res) {
  
  const email = req.body.email;
  const password = req.body.password;
  var formOutputHospital = [email];

  connection.query(
    "SELECT * FROM hospital_data WHERE email=?",
    formOutputHospital,
    async function (err, result, fields) {
      if (err) throw err;
      
      else {
       
        if (result.length > 0 && (await bcrypt.compare(req.body.password, result[0].password))) {
       
          hospital_details = result[0];
          res.render("hospital/hospital_dashboard", hospital_details);
        
        } else {
         
          res.render("handle_message" ,{message: "Login failed"});
         
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


router.get("/add-blood", function (req, res, next) {
  res.render("hospital/add_blood");

});

router.post("/add-blood", function (req, res) {

  const blood_type = req.body.bloodtype;
  const unit = req.body.unit;
  // var formOutputHospital = [blood_type, unit];

  connection.query(
    "SELECT * FROM blood_bank where hospital_id=" + hospital_details.id,
    function (err, result) {
      if (err) throw err;
      else {

        if (result.length > 0) {
          var query =
            "UPDATE blood_bank SET " +blood_type +"=" +blood_type +" +" +unit +
            " WHERE hospital_id = " +hospital_details.id;
         
            //Main query
          connection.query(
            query,
            function (err, result) {
              if (err) throw err;
              
              else {
                res.render("handle_message", {
                  message: "Blood Details Added Successfully"
                });
                res.send();
              }
            }
          );
        } 
        else {
          var query = "insert into blood_bank (hospital_id) values (" + hospital_details.id +")";

          connection.query(query, function (err, result, fields) {
            if (err) throw err;
            else {
              query =
                "UPDATE blood_bank SET " +blood_type +"=" + blood_type +" +" +unit +
                " WHERE hospital_id = " +hospital_details.id;
              //Main query
              connection.query(
                query,
                function (err, result) {
                  if (err) throw err;
                  else {
                    
                    res.render("handle_message", {
                      message: "Blood Details Added Successfully"
                    });
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
  
  connection.query(
    sqlQuery,
    function (err, result) {
      if (err) {
        throw err;
      } 
      else {

        obj = { blood_details: result };
        res.render("hospital/blood_info", obj);
        obj = {};

      }
    }
  );

});

router.post("/view-blood-info", function (req, res) {

});

//view request
router.get("/requests", function (req, res, next) {
  var obj = {};
  var query = "SELECT * FROM blood_requests where hospital_id="+hospital_details.id+" ORDER BY time DESC" ;
  
  connection.query(query, function (err, result) {
    if (err) {
      throw err;
    } 
    else {
     
      obj = { request_details: result};
      res.render("hospital/requests", obj);
      obj = {};
    
    }
  });

});


router.post("/requests", function (req, res) {

const request_id=req.body.request_id;

var query="SELECT * FROM blood_requests where id=" + request_id;

connection.query(
  query,
  function (err, result) {
    if (err) throw err;
    else {

      if (result.length > 0 ) {
        var query =
          "UPDATE blood_requests SET approved = 'Y'"  +
          " WHERE id = " +request_id;

        connection.query(
          query,
          function (err, result) {
            if (err) throw err;
            else {
              
              res.redirect("/hospital/requests");
            
            }
          }
        );
      } else {
        res.render("handle_message", {
          message: "invalid request"
        });
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
