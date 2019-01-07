//pagiation for list of users
const slugify = require('slugify');
exports.paginationControl = async (req) => {
    pager = {};

    var pageNumber = parseInt(req.query.pn);
    if (pageNumber) {
        pager.pageNumber = pageNumber;
    } else {
        pager.pageNumber = 1;
    }

    var pageSizeLimit = parseInt(req.query.l);
    if (pageSizeLimit) {
        pager.pageSizeLimit = pageSizeLimit;
    } else {
        pager.pageSizeLimit = 5;
    }

    return {
        pageNumber: pager.pageNumber,
        pageSizeLimit: pager.pageSizeLimit
    }
}

//responding the validated error by returning them in array
exports.errorMessageControl = (msg) => {
    messages = [];
    for (let index = 0; index < msg.length; index++) {
        const element = msg[index].msg;
        messages[index] = element;
    }
    return messages;
}

exports.slugifyTitle = (title) => {
    return slugify (title,{
        replacement : '-',
        remove:null,
        lower:true
})
}
