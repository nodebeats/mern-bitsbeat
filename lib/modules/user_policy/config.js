exports.messageConfig = {
  validateErrMsg: {
    policy_title: "Policy Title Should be defined",
    policy_roue: "Route should be defined",
    policy_description: "Description is required"
  },
  policy: {
    policyConflict: {
      code: 409,
      status: "Conflict",
      message: "This Title already exists!",
    },
    policyError: {
      code: 409,
      status: "Error",
      message: "Error has occured"
    },
    policySuccesful: {
      code: 200,
      status : "Successful",
      message:"The request has been successfully posted"
    }

  }
}
