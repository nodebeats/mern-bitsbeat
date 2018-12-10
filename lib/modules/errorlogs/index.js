

exports.log_error = async (err, req, res, next) => {

    const collection = global.db.collection('errors');

    try {
        const save = await collection.insertOne({
            errMessage: err.toString(),
            addedOn: new Date()
        });

        console.log("Errrrrrrrrrrrrrrrrrrrrrrrrrrr");
        res.json({
            errMessage: err.toString(),
            addedOn: new Date(),
            message: "Error saved!!!"
        })

    } catch (error) {
        res.json({
            errMessage: "Error saving !!"
        })

    }


}

exports.getAllErrors = async (req, res) => {

    const collection = global.db.collection('errors');

    try {
        const data = await collection.find().sort({ addedOn: -1 }).toArray();
        res.json(data);
    } catch (error) {
        console.log(error);
        res.json({
            message: "Error fetching, something went wrong"
        });
    }

}
