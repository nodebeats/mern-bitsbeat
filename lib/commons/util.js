exports.renderApiData = (req, res, responseCode, responseMessage, data = {}) => {
    let sendData = {
        status: responseCode,
        success: true,
        message: responseMessage,
        data
    }
    return sendData;
}

exports.renderApiErr = (req, res, responseCode, responseMessage) => {
  
    let errorData = {
        status: responseCode,
        success: false,
        message: responseMessage
    }

    return errorData;
}
