<<<<<<< HEAD
//pagiation for list of users
=======
>>>>>>> f564c9f0fd3e6b49188e1566529a9e6f4f000ded
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

<<<<<<< HEAD
//responding the validated error by returning them in array
=======

>>>>>>> f564c9f0fd3e6b49188e1566529a9e6f4f000ded
exports.errorMessageControl = (msg) => {
    messages = [];
    for (let index = 0; index < msg.length; index++) {
        const element = msg[index].msg;
        messages[index] = element;
    }
<<<<<<< HEAD
    return messages;
}
=======
   
    return messages;
 }

>>>>>>> f564c9f0fd3e6b49188e1566529a9e6f4f000ded
