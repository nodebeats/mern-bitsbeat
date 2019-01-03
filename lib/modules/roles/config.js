exports.messageConfig = {
    validationErrMsg:{
        roleName : "Role Name is required",
        description: "Descripetion is required",
        policy_title: "Policy title is required"
    },
    role:{
        roleCreateSuccess:{
            status:"OK",
            message:"role Succesfully created"
        },
        roleReadMsg:{
            status:"Not Found",
            message:"No any role list"
        },
        roleDeleteMsg:
        {    status:"OK",
            message:"role deleted Succesfully"
        },
        roleUpdateMsg:{
            status:"OK",
            message:"role updated Successfully"
        },
        roleConflictMsg:{
            errMessage:"Role is already created" 

        }
    }
}