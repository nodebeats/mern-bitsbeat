
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
