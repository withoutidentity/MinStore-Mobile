const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
    CompanyController: {
        create: async (req, res) => {
            try {
                const oldComapany = await prisma.company.findFirst();
                const payload = {
                    name: req.body.name,
                    address: req.body.address,
                    phone: req.body.phone,
                    email: req.body.email ?? '',
                    taxCode: req.body.taxCode
                }
                if (oldComapany) { // ถ้ามีข้อมูลซ้ำ
                    await prisma.company.update({ //จะทำการอัพเดทข้อมูล
                        where: { id: oldComapany.id },
                        data: payload
                    });
                } else {
                    await prisma.company.create({ data: payload}); //ถ้าไม่ซ้ำ ก็จะสร้างข้อมูลใหม่
                }

                res.json({ message: "success" });
            } catch (error) {
                res.status(500).json({ message: error.message});
            }
        },
        list: async (req, res) => {
            try {
                const company = await prisma.company.findFirst();
                res.json(company);
            } catch (err) {
                res.status(500).json({ error: err.message});
            }
        }
    }
}