exports.messageConfig = {
    validateErrMsg: {
      category_title: "News Title Should be defined",
      category_description: "Description is required",
      author: "Author should be defined",
    },
    news: {
      newsConflict: {
        code: 409,
        status: "Conflict",
        message: "This Title already exists!",
      },
      newsError: {
        code: 409,
        status: "Error",
        message: "Error has occured"
      },
      newsSuccesful: {
        code: 200,
        status: "Successful",
        message: "The request has been successfully carried out"
      }
    }
  }
  