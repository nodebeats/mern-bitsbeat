exports.messageConfig = {
    validationErrMsg:{
        title : "title is required",
        description: "Description is required",
        tags: " tag is required",
        author: "author is required",
        banner: "banner is required"
    },
    blog:{
        blogCreateSuccessfull:{
            code: 200,
            status:"OK",
            message:"Title Succesfully created"
        },
        BlogReadMsg:{
            code: 404,
            status:"Not Found",
            message:"No any blog list found"
        },
        BlogUpdatemsg:{
            code: 200,
            status:"OK",
            message:"Blog updated Successfully"
        },
        BlogDeleteMsg:{
            code: 200,
            status: "OK",
            message: "Blog deleted Successfully"
        },
        titleConflict:{
            code: 409,
            status: "Conflict",
            message: "Title already exist"
        }
    }
}