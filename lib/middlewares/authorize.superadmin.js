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
        let roleData = await global.db.collection('role').findOne({ user_role: data.user_role });

        let policyData = await global.db.collection('policy').find({ policy_title: { $in: roleData.policy_title } }).toArray();
        console.log(policyData);


        for (let index in policyData) {

            if (policyData[index].policy_method === "POST") {
                if (req.originalUrl == policyData[index].policy_route) {
                    next();
                } else {
                    console.log(policyData[index].policy_method);
                    res.json({
                        code: 401,
                        status: "Unauthorized",
                        message: "Sorry, you are not authorized to perform this task"
                    });

                }

            } else if (policyData[index].policy_method === "GET") {
                if (req.originalUrl == policyData[index].policy_route) {
                    console.log("I am here.........");
                    next();
                } else {
                    // console.log("Hello I am here");
                    console.log(policyData[index].policy_method);
                    res.json({
                        code: 401,
                        status: "Unauthorized",
                        message: "Sorry, you are not authorized to perform this task"
                    });

                }


            } else if (policyData[index].policy_method === "DELETE") {
                if (req.originalUrl == policyData[index].policy_route) {
                    console.log("I am here.........");
                    next();
                } else {
                    // console.log("Hello I am here");
                    console.log(policyData[index].policy_method);
                    res.json({
                        code: 401,
                        status: "Unauthorized",
                        message: "Sorry, you are not authorized to perform this task"
                    });

                }

            }

            else {
                console.log("Nothing");
            }
        }



    }
}
