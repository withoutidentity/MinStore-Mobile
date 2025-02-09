const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { create } = require("domain");

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

                res.json({ token: token, level: user.level });

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
        },
        list: async (req, res) => {
            try {
                const users = await prisma.user.findMany({
                    where: {
                        status: 'active'
                    },
                    orderBy: {
                        id: 'desc'
                    }
                });

                res.json(users);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        },
        create: async (req, res) => {
            try {
                await prisma.user.create({
                    data: {
                        name: req.body.name,
                        username: req.body.username,
                        password: req.body.password,
                        level: req.body.level
                    }
                });
                res.json({ message: 'success'});
            } catch (error) {
                res.status(500).json({ message: error.message});
            }
        },
        updateRow: async (req, res) => {
            try {
                const oldUser = await prisma.user.findFirst({
                    where: { id: req.params.id }
                });
                const newPassword = req.body.password !== "" ? req.body.password : oldUser.password;

                await prisma.user.update({
                    where: { id: req.params.id},
                    data: {
                        name: req.body.name,
                        username: req.body.username,
                        password: newPassword,
                        level: req.body.level
                    }
                });
                res.json({ message: 'success'});
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        },
        remove: async (req, res) => {
            try {
                await prisma.user.update({
                    where: { id: req.params.id },
                    data: { status: 'inactive' }
                });
                res.json({ message: 'success' });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        }
    }
}