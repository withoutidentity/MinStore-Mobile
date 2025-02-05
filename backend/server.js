const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");

//controller
const { UserController } = require("./controllers/UserController"); 
const { CompanyController } = require("./controllers/CompanyController"); 
const { ProductController } = require("./controllers/ProductController");
const { SellController } = require("./controllers/SellController");

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

//company create data
app.post("/api/company/create", CompanyController.create);
//company list
app.get("/api/company/list", CompanyController.list);

//buyProduct create
app.post("/api/buy/create", ProductController.create);
//product list
app.get("/api/buy/list", ProductController.list);
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
    console.log(`http://localhost:${port}`)
});
