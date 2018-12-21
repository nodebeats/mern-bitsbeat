exports.authorize = async (req, res, next) => {
    const ObjectID = require('mongodb').ObjectID;


    const collection = global.db.collection('User');
    console.log('req.decodedUser', req.decodedUser.userId);


    const data = await collection.findOne({ _id: ObjectID(req.decodedUser.userId) }, { projection: { _id: 1, first_name: 1, last_name: 1, email: 1, salutation: 1, user_role: 1 } });
    console.log(data.user_role);

    if (data.user_role === "superuser") {
        next();
    } else {

        //Role -> user_role
        const roleData = await global.db.collection('role').findOne({ user_role: data.user_role });
        console.log("Role policy title == ", roleData.policy_title);

        const policyData = await global.db.collection('policy').findOne({ policy_title: roleData.policy_title.toLowerCase() },{ policy_method: { $in: ["GET","POST", "PATCH"] } });
        console.log(policyData.policy_title);


            switch (req.method) {
                case "POST":
                    if (policyData.policy_title === "create" || policyData.policy_title === "write") {
                        next();
                    } else {
                        // console.log(req.method);
                        // console.log('Errrrr');
                        return res.json({
                            code: 401,
                            status: "Unauthorized",
                            message: "Sorry, you are not authorized to perform this task"
                        });

                    }
                    break;
                case "GET":
                    if (policyData.policy_title === "read") {
                        next();
                    } else {
                        // console.log("Hello I am here");
                        return res.json({
                            code: 401,
                            status: "Unauthorized",
                            message: "Sorry, you are not authorized to perform this task"
                        });

                    }
                    break;

                case "DELETE":
                    if (policyData.policy_title === "delete") {
                        next();
                    } else {
                        return res.json({
                            code: 401,
                            status: "Unauthorized",
                            message: "Sorry, you are not authorized to perform this task"
                        });

                    }

                    break;

                default:
                    res.json({ message: "Options Not available" });
                    break;
            }
            
        

    }
}
