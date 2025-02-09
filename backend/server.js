const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");

//controller
const { UserController } = require("./controllers/UserController"); 
const { CompanyController } = require("./controllers/CompanyController"); 
const { ProductController } = require("./controllers/ProductController");
const { SellController } = require("./controllers/SellController");
const { ServiceController } = require("./controllers/ServiceController");

//middleware
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello minmobile")
})

//user sig in
app.post("/api/user/signin", UserController.signIn);
//user auth
app.get("/api/user/info", UserController.info);
//user new password
app.put("/api/user/update", UserController.update);
//list user
app.get("/api/user/list", UserController.list);
//create user
app.post("/api/user/create", UserController.create);
//change password
app.put("/api/user/update/:id", UserController.updateRow);
//change status to inactive and remove in ชื่อผู้ใช้งาน
app.delete("/api/user/remove/:id", UserController.remove);

//company create data
app.post("/api/company/create", CompanyController.create);
//company list
app.get("/api/company/list", CompanyController.list);

//buyProduct create
app.post("/api/buy/create", ProductController.create);
//product list
app.get("/api/buy/list/:page", ProductController.list);
// update product
app.put("/api/buy/update/:id", ProductController.update); //:id คือ รับไอดี
//delete product
app.delete("/api/buy/remove/:id", ProductController.remove); 

//
//sell
//
//create data sell
app.post("/api/sell/create", SellController.create);
// list sell
app.get("/api/sell/list", SellController.list);
// remove some sell
app.delete("/api/sell/remove/:id", SellController.remove);
// confirm order
app.get("/api/sell/confirm",SellController.confirm);
//dashboard
app.get("/api/sell/dashboard", SellController.dashboard);
//history
app.get("/api/sell/history", SellController.history);
app.get("/api/sell/info/:id", SellController.info);

//
// Service
//
//create service
app.post("/api/service/create", ServiceController.create);
//list service
app.get("/api/service/list", ServiceController.list);
//update service
app.put("/api/service/update/:id", ServiceController.update);
//delete service
app.delete("/api/service/remove/:id", ServiceController.remove);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
    console.log(`http://localhost:${port}`)
});
