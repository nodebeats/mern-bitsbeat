exports.authorize = async (req, res, next) => {
    const ObjectID = require('mongodb').ObjectID;


    const collection = global.db.collection('User');
    console.log('req.decodedUser', req.decodedUser.userId);


    const data = await collection.findOne({ _id: ObjectID(req.decodedUser.userId) }, { projection: { _id: 1, first_name: 1, last_name: 1, email: 1, salutation: 1, user_role: 1 } });
    console.log(data.user_role);

    if (data.user_role === "superuser" || data.user_role === "superadmin") {
        next();
    } else {

        //Role -> user_role
        let roleData = await global.db.collection('role').findOne({ user_role: data.user_role });

        let rolePolicies = await global.db.collection('role').aggregate([
            {
                $match: { 'user_role': data.user_role, 'policy_title': { $in: roleData.policy_title } }
            },

            {
                $lookup:
                {
                    from: 'policy',
                    localField: 'policy_title',
                    foreignField: 'policy_title',
                    as: 'policy_list'
                }
            },
            {
                $project: {
                    'policy_list.policy_title': 1,
                    'policy_list.policy_route': 1,
                    'policy_list.policy_method': 1
                }
            }
        ]).toArray();

        if (rolePolicies.length > 0) {
            rolePolicies = rolePolicies[0];
            let policies = rolePolicies.policy_list;
            // console.log('policy list => ', policies);

            const lstPolicies = policies.filter((item, index) => {
                if ((req.originalUrl == item.policy_route) && (item.policy_method === "POST" || item.policy_method === "PATCH" || item.policy_method === "GET" || item.policy_method === "DELETE")) {
                    return item;
                }
            });

            if (lstPolicies && lstPolicies.length > 0) {
                next();
            } else {
                res.json({
                    code: 401,
                    status: "Unauthorized",
                    message: "Sorry, you are not authorized to perform this task"
                });

            }

        }
        else {
            res.json({ message: "No policies availble" })
        }

    }
}
