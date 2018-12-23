

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

    const paginate = require('../../helpers/utilities.helper');
    let  request = await paginate.paginationControl(req);


    const collection = global.db.collection('errors');

    try {
        const paginationList = await collection.find().skip((request.pageNumber - 1) * request.pageSizeLimit).limit(request.pageSizeLimit).sort({ addedOn: -1 }).toArray();
        
        if (paginationList.length > 0) {
            res.status(200).json({
                status_code: "200",
                status: "Ok",
                msg: paginationList
            });
        } else {
            res.status(200).json({
                status_code: "200",
                status: "Ok",
                msg: "There are no user to display"
            });
        }
    } catch (error) {
        console.log(error);
        res.json({
            message: "Error fetching, something went wrong"
        });
    }

}
