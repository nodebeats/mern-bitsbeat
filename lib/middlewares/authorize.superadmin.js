exports.authorize = async (req, res, next) => {

    const collection = global.db.collection('User');

    const role = await collection.findOne({ user_role: superadmin });

    if (!role) {
        return res.json({
            code: 401,
            status: "Unauthorized",
            message: "Sorry, you are not authorized to perform this task"
        })
    } else {
        next();

    }






}