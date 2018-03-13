/**
 * Created by annae on 12.02.2018.
 */
module.exports = fn =>
    (req,res,next) => fn(req,res,next).catch(next);