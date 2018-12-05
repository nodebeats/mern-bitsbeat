
const checkSA = ( req ,res ,next)=>{
    if( req.body.userRole == "SA"){
        next();
    }
}

const checkUserRole = ( req ,res ,next)=>{
    if( req.body.userRole =="user" || req.body.userRole =="SA"){
        next();
    }
    else{
        res.json({
            message:"You are not authorized"
        })
    }
}

module.exports ={ checkSA,checkUserRole }