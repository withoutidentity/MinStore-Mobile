const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");

//controller
const { UserController } = require("./controllers/UserController"); 
const { CompanyController } = require("./controllers/CompanyController"); 
const { ProductController } = require("./controllers/ProductController")

//middleware
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello minmobile")
})

//sig in
app.post("/api/user/signin", UserController.signIn);

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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
    console.log(`http://localhost:${port}`)
});
