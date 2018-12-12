exports.messageConfig = {
    default_super_user:{
        default_super_user:{
            first_name:"super",
            last_name:"admin",
            email:"super@admin.com",
            salutation:"Mr.",
            user_role:"superuser",
            agree_terms_condition:true,
            added_on:new Date()
        },
        default_super_user_password:{
            password:"admin"
        }
    },
    emailErr:{
        conflictMessage:{
            err:"conflict Error",
            message:"Email already exists"
        },
        validationErr:{
            email:"Email must contain '@' and '.' in respective places."
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
        first_name_alpha:"First name should be all alphabets",
        last_name:"Last name is requred and must only be string",
        last_name_alpha:"Last name should be all alphabets",
        email:"Email field is required",
        salutation:"Salutation field is required is required",
        salutationField:"Only either Mr. or Mrs.",
        user_role:"User role is required",
        user_role_field:"User role must be secific",
        password:"password field cannot be empty",
        agree_terms_condition:"The terms and condition must be checked",
        not_found:"The user not found"
    }
    
};