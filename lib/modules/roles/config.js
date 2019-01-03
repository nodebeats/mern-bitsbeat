exports.messageConfig = {
    validationErrMsg:{
        user_role : "Role Name is required",
        description: "Descripetion is required",
        policy_title: "Policy title is required"
    },
    role:{
        roleCreateSuccess:{
            code: 200,
            status:"OK",
            message:"role Succesfully created"
        },
        roleReadMsg:{
            code: 404,
            status:"Not Found",
            message:"No any role list"
        },
        roleDeleteMsg:
        {   code: 200, 
            status:"OK",
            message:"role deleted Succesfully"
        },
        roleUpdateMsg:{
            code: 200,
            status:"OK",
            message:"role updated Successfully"
        },
        roleConflictMsg:{
            code: 409,
            status: "Conflict",
            message:"Role is already created" 

        }
    }
}