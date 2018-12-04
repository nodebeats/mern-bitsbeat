const index = require("./index"),
  //config = require('./config'),
  express = require("express"),
  router = express.Router();

  // const roleMiddleware = ( req ,res ,next)=>{
  //     console.log(req.body,"middleware");
  //     if(user){
  //       next()
  //     }
  //     else{
  //       res.json({
  //         "message" : ""
  //       })
  //     }
  // }

// router.post("/role/add",roleMiddleware, index.addUser);
router.post("/role/add", index.addRole);
router.get("/role/read", index.readRole);
router.get("/role/read/:id", index.readroleById);
router.put("/role/update/:id", index.UpdateById);
router.patch("/role/delete/:id", index.deleteById);

module.exports = router;
