var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
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

  var formOutputPatient = [name, email, password, contact, bloodtype];

  connection.query(
    "INSERT INTO patient_data (name,email,password,contact,blood_group) values (?)",
    [formOutputPatient],
    function (err, result) {
      if (err) throw err;
      else {
        res.render("handle_message", { message: "SignUp Successful" });
      }
    }
  );
});

router.post("/signin", function (req, res) {
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;

  connection.query(
    "SELECT * FROM patient_data WHERE email=? ",
    [email],
    async function (err, result, feilds) {
      if (err) throw err;
      else {
        if (
          result.length > 0 &&
          (await bcrypt.compare(req.body.password, result[0].password))
        ) {

          patient_details = result[0];

          res.render("patient/patient_dashboard", patient_details);
        } else {
          res.render("handle_message" ,{message: "Login failed"});
          
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

router.get("/available-blood", function (req, res, next) {

  var obj = {};
  var query =
    "select blood_bank.id as id,name,hospital_id,a_positive,a_negative,b_positive,b_negative,ab_positive,ab_negative,o_positive,o_negative from hospital_data,blood_bank where hospital_id=hospital_data.id";

  connection.query(query, function (err, result) {
    if (err) {
      throw err;
    } else {
      var blood_details = result;

      obj = {
        blood_details: result,
        pat_id: patient_details ? patient_details.id : "0",
      };

      console.log("result----obj-- ",obj);
      res.render("patient/available_blood", obj);
    }
  });
});

router.post("/available-blood", function (req, res) {
  console.log(req.body);

  const blood_type = req.body.bloodtype;
  const hospital_id = req.body.hospital_id;
  const pat_id = req.body.pat_id;
  var formOutputPatient = [pat_id, hospital_id, blood_type];

  if (pat_id === "0") {
    res.render("handle_message", { message: "Please SignIn as Patient" });
  } else {
    var query =
      "insert into blood_requests (patient_id,hospital_id,blood_type) values (?)";
    connection.query(
      query,
      [formOutputPatient],
      function (err, result, feilds) {
        if (err) throw err;
        else {
          res.render("handle_message", {
            message: "Your Request has been successfully placed"
          });
        }
      }
    );
  }
});

module.exports = router;
