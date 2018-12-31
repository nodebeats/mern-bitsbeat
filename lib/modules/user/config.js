exports.messageConfig = {
  default_super_user: {
    first_name: "super",
    last_name: "user",
    email: "super@admin.com",
    password: "adminAdmin123!@",
    salutation: "Mr.",
    user_role: "superuser",
    agree_terms_condition: true,
    added_on: new Date()
  },

  emailErr: {
    conflictMessage: {
      err: "conflict Error",
      message: "Email already exists"
    },
    validationErr: {
      email: "Email must contain '@' and '.' in respective places."
    }
  },
  user: {
    userCreateSuccess: {
      code: 200,
      status: "OK",
      message: "User sucessfully created"
    },
    userDeleteMsg: {
      code: 200,
      status: "OK",
      message: "User deleted Succesfully"
    },
    userUpdateMsg: {
      code: 200,
      status: "OK",
      message: "User updated Successfully"
    },
    userVerifiedMsg: {
      code: 200,
      status: "Success",
      message: "Email verified successfully"
    },
    userNotVerified: {
      code: 304,
      status: "error",
      message: "Data not modified"
    },
    Mismatch: {
      code: 400,
      status: "mismatch",
      message: "Email and User Id doesn't match"
    },
    alreadyVerified: {
      code: 401,
      status: "Unauthorized",
      message: "Token is not found"
    },
    userCreateSuccess: "User sucessfully created",
    userDeleteMsg: "User deleted Succesfully",
    userUpdateMsg: "User updated Successfully",
    getUserEmptyMessage: "There are no user to display",

    validationErrMessage: {
      first_name: "First name is required",
      first_name_alpha: "First name should be all alphabets",
      last_name: "Last name is requred and must only be string",
      last_name_alpha: "Last name should be all alphabets",
      email: "Email field is required",
      salutation: "Salutation field is required is required",
      salutationField: "Only either Mr. or Mrs.",
      user_role: "User role is required",
      user_role_field: "User role must be secific",
      password: "password field cannot be empty",
      passwordCharacter:
        "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 char long",
      agree_terms_condition: "The terms and condition must be checked",
      not_found: "The user not found"
    },
    token: {
      sent_message: "Token successfully sent"
    }
  }
};
