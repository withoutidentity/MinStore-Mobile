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

                const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: "1m" });

                res.json({ token: token });

            } catch (error) {
                res.status(500).json({ message: error.message});
            }
        }
    }
}