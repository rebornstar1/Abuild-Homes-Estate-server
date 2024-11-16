const express = require("express");
const {AgentPost} = require("../Controllers/AgentController.js");
const {AgentGet} = require("../Controllers/AgentController.js");
const {AgentDelete} = require("../Controllers/AgentController.js");
const {AgentPut} = require("../Controllers/AgentController.js");
const verify = require("../Middlewares/verifyToken.js");

const router = express.Router();

router.get('/getIt',verify(["Admin", "SuperAdmin","Agent"]),AgentGet);
router.put('/putIt',verify(["Admin", "SuperAdmin","Agent"]),AgentPut);
router.delete('/deleteIt',AgentDelete);
router.post('/postIt',AgentPost);

module.exports = router;


// This Verification Should be Done using JWT Token Instead of 
// using the req.body itself