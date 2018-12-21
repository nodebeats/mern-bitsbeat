exports.messageConfig = {
    validateErrMsg: {
      news_title: "News Title Should be defined",
      news_author: "Author should be defined",
      news_description: "Description is required",
      email:"Email must contain '@' and '.' in respective places."
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
        message: "The request has been successfully posted"
      }
  
    },
    subscribe:{
      subscriptionSucess: {
        code: 200,
          status: "Successful",
          message: "The request has been successfully posted"
      },
      subscriptionError: {
        code: 409,
        status: "Error",
        message: "Error "
      }
    }
    
  }
  