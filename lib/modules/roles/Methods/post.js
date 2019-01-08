const post = require('../index');

exports.addRole = async (req, res, next) => {
    try {
      let validation = await validationCheck(req);
      if (!validation.length > 0) {
        const findRole = await db.collection('role').findOne({
          user_role: req.body.user_role.toLowerCase()
        });
        if(findRole){
            res.status(409).json(config.messageConfig.role.roleConflictMsg);
        }else {
  
          // const policy_title = await db.collection('policy').findOne({policy_title:req.body.policy_title});
          const user_role = req.body.user_role.toLowerCase(),
            description = req.body.description,
            added_on = new Date(),
            policy_title = req.body.policy_title,
            deleted = false;
  
  
            db.collection("role").insertOne({user_role,description,added_on,policy_title});
            res.json(util.renderApiData(req,res,200,config.messageConfig.role.roleCreateSuccess,
            {user_role:user_role,description:description,policy_title:policy_title}));
        }
      } else {
        res.status(400).json({
          status_code: "400",
          status: "Bad Request",
          err: paginate.errorMessageControl(validation)
        });
      }
  
    } catch (err) {
      next(err)
    }
  };
  