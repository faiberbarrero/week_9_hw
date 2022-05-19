module.exports = function(app) {
    app.use("/auth", require("./auth"))  
    app.use("/post", require("./post"))
    app.use("/", require("./dashboard")) 
    
};