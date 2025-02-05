const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const prisma = new PrismaClient();

module.exports = {
    UserController: {
        signIn: async (req, res) => {
            try {
                const user = await prisma.user.findFirst({
                    where: {
                        username: req.body.username,
                        password: req.body.password,
                        status: "active"
                    }
                });

                if (!user) return res.status(401).json({message: "User not found"});

                const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: "7d" });

                res.json({ token: token });

            } catch (error) {
                res.status(500).json({ message: error.message});
            }
        },
        info: async (req, res) => {
            try {
                const headers = req.headers.authorization;
                const token = headers.split(" ")[1];
                const decoded = jwt.verify(token, process.env.SECRET_KEY);
                const user = await prisma.user.findFirst({
                    where: { id: decoded.id },
                    select: {
                        name: true,
                        level: true,
                        username: true,
                    }
                });
                res.json(user);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        },
        update: async (req, res) => {
            try {
                const headers = req.headers.authorization;
                const token = headers.split(" ")[1];
                const decoded = jwt.verify(token, process.env.SECRET_KEY);
                const oldUser = await prisma.user.findFirst({
                    where: { id: decoded.id },
                });
                const newPassword = req.body.password !== "" ? req.body.password : oldUser.password;
                await prisma.user.update({
                    where: { id: decoded.id },
                    data: {
                        name: req.body.name,
                        username: req.body.username,
                        password: newPassword
                    }
                })
                
                res.json({ message: 'success'});
            } catch (error) {
                res.status(500).json({ message: error.message});
            }
        }
    }
}