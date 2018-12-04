// ((roleConfig)=> {
//     'use strict'
//     messages : {
//         insert_success : "user role successfully inserted!"
//     }
    
// })(module.exports)


// exports.messages = {
//         insert_success : "user role successfully inserted!"
// }

(() => {
    "use strict";

    module.exports = {
        message: {
            notFound: "",
            detailNotFound: "",
            blockedErrorMessage: '',
            blockedSuccessMessage: '',
            errorBlockingTransaction: ''
        },
        config: {
            isActive: true
        }
    };

})();