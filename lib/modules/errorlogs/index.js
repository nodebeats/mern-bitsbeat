const util = require('../../commons/util');

exports.log_error = async (err, req, res, next) => {

    const collection = global.db.collection('errors');

    try {
        const save = await collection.insertOne({
            errMessage: err.toString(),
            addedOn: new Date()
        });

        console.log("Errrrrrrrrrrrrrrrrrrrrrrrrrrr");
        res.json(util.renderApiData(req, res, '200', 'Error Saved', { errMessage: err.toString(), addedOn: new Date() }));

    } catch (error) {
        res.json(util.renderApiErr(req, res, 500, 'Error saving'));
    }


}

exports.getAllErrors = async (req, res) => {

    const paginate = require('../../helpers/utilities.helper');
    let request = await paginate.paginationControl(req);


    const collection = global.db.collection('errors');

    try {
        const paginationList = await collection.find().skip((request.pageNumber - 1) * request.pageSizeLimit).limit(request.pageSizeLimit).sort({ addedOn: -1 }).toArray();

        if (paginationList.length > 0) {
            res.json(util.renderApiData(req, res, '200', 'OK', { msg: paginationList }));

        } else {
            res.json(util.renderApiErr(req, res, '200', 'There are no errors to display'));

        }
    } catch (error) {
        console.log(error);
        res.json(util.renderApiErr(req, res, '404', 'Not Found!'))
    }

}
