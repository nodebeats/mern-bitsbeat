exports.messageConfig = {
    validationErrMsg:{
        blog_category_title : "title is required",
        blog_description: "Description is required"
    },
    blogCategory:{
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
        },
        cannotDelete:{
            code:405,
            status: "Method Not allowed"
        }
    }
}