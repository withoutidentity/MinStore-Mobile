const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
    SellController: {
        create: async (req, res) => {
            try {
                const serial = req.body.serial;
                const product = await prisma.product.findFirst({
                    where: { 
                        serial: serial,
                        status: 'instock' 
                    }
                });

                if (!product)  {
                    res.status(400).json({ message: 'Product not found'});
                    return;
                }
                await prisma.sell.create({
                    data: {
                        productId: product.id,
                        price: req.body.price,
                        payDate: new Date()
                    }
                });
                res.json({ message: "success" });
            } catch (error) {
                res.status(500).json({ message: error.message});
            }
        },
        list: async (req, res) => {
            try {
                const sells = await prisma.sell.findMany({
                    where: {
                        status: 'pending'
                    },
                    orderBy: {
                        id: 'desc'
                    },
                    select: {
                        product: {
                            select: {
                                serial: true,
                                name: true
                            }
                        },
                        id: true,
                        price: true
                    }
                });
                res.json(sells);
            } catch (error) {
                res.status(500).json({ message: error.message});
            }
        },
        remove: async (req, res) => {
            try {
                await prisma.sell.delete({
                    where: {
                        id: req.params.id
                    }
                });
                res.json({ message: 'success'});
            } catch (error) {
                res.status(500).json({ message: error.message});
            }
        },
        confirm: async (req, res) => {
            try {
                const sells = await prisma.sell.findMany({
                    where: {
                        status: 'pending'
                    }
                });

                for (const sell of sells) {
                    await prisma.product.update({
                        data: {
                            status: 'sold'
                        },
                        where: {
                            id: sell.productId
                        }
                    })
                }
                await prisma.sell.updateMany({
                    where: {
                        status: 'pending'
                    },
                    data: {
                        status: 'paid',
                        payDate: new Date()
                    }
                });
                res.json({ message: 'success' });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        },
        dashboard: async (req, res) => {
            try {
                const income = await prisma.sell.aggregate({
                    _sum: {
                        price: true
                    },
                    where: {
                        status: 'paid'
                    }
                });
                const countRepair = await prisma.service.count();
                const countSell = await prisma.sell.count({
                    where: {
                        status: 'paid'
                    }
                });
                return res.json ({
                    totalIncome: income._sum.price,
                    totalRepair: countRepair,
                    totalSale: countSell
                });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        }
    }
}