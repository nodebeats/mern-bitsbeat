exports.messageConfig = {
    emailErr:{
        conflictMessage:{
            err:"conflict Error",
            message:"Email already exists"
        },
        validationErr:{
            email:"Email must not start with numbers.It must contain '@' and '.' in respective places."
        }
    },
    user:{
        userCreateSuccess:{
            status:"OK",
            message:"User sucessfully created"
        },
        userDeleteMsg:{
            status:"OK",
            message:"User deleted Succesfully"
        },
        userUpdateMsg:{
            status:"OK",
            message:"User updated Successfully"
        }
    },
    validationErrMessage:{
        first_name:"First name is required",
        last_name:"Last name is requred",
        email:"Email field is required",
        salutation:"Salutation field is required is required",
        salutationField:"Only either Mr. or Mrs.",
        user_role:"User role is required",
        user_role_field:"User role must be secific",
        password:"password field cannot be empty"
    }
    
};