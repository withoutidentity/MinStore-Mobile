'use client'

import { useState, useEffect } from "react";
import axios from "axios";
import { config } from "@/app/congig";
import Swal from "sweetalert2";
import Modal from "@/app/backoffice/modal";

export default function Page() {
    const [isOpen, setIsOpen] = useState(false);
    const [serial, setSerial] = useState('');
    const [name, setName] = useState('');
    const [release, setRelease] = useState('');
    const [color, setColor] = useState('');
    const [price, setPrice] = useState(0);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [remark, setRemark] = useState('');
    const [products, setProducts] = useState([]); //สินค้าที่ซื้อ
    const [id, setId] = useState(0); //id เอาไว้แก้ไขรายการ
    const [qty, setQty] = useState(1); //จำนวนสินค้า default ให้เป็นจำนวน1ชิ้น

    /*
    pagination
    */
   const [page,setPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [totalRows, setTotalRows] = useState(0);

    useEffect(() => {
        fetchData();
    }, [page]);

    const fetchData = async () => { //ดึงข้อมูลของโปรดัก
        try {
            const respone = await axios.get(`${config.apiUrl}/buy/list/${page}`);
            setProducts(respone.data.products);
            setTotalRows(respone.data.totalRows);
            setTotalPages(respone.data.totalPages);
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'ผิดพลาด',
                text: err.message,
            })
        }
    }

    const handleOpenModal = () => {
        setIsOpen(true);
    }

    const handleCloseModal = () => {
        setIsOpen(false);
    }

    const handleSave = async () => {
        try {
            const payload = {
                serial: serial,
                name: name,
                release: release,
                color: color,
                price: price,
                customerName: customerName,
                customerPhone: customerPhone,
                customerAddress: customerAddress,
                remark: remark,
                qty: qty
            }
            if (id === 0) { //เพิ่มรายการ
                await axios.post(`${config.apiUrl}/buy/create`,payload); //ส่งข้อมูลไปยัง db
            } else { //แก้ไขรายการ
                await axios.put(`${config.apiUrl}/buy/update/${id}`,payload);
                setId(0);
            }
            Swal.fire({
                icon: 'success',
                title: 'บันทึกข้อมูลเรียบร้อย',
                text: 'ข้อมูลถูกบันทึกเรียบร้อย',
                timer: 2000
            });

            handleCloseModal(); //ปิดกล่องที่เพิ่มข้อมูล
            fetchData(); // ดึงข้อมูลล่าสุดมา
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'ผิดพลาด',
                text: 'ไม่สามารถบันทึกข้อมูล',
            });
        }
    }

    const handleEdit = (id: number) => {
        const product = products.find((product: any) => product.id === id) as any;
        setSerial(product.serial ?? '');
        setName(product.name);
        setRelease(product.release);
        setColor(product.color);
        setPrice(product.price);
        setCustomerName(product.customerName);
        setCustomerPhone(product.customerPhone);
        setCustomerAddress(product.customerAddress ?? '');
        setRemark(product.remark ?? '');
        setId(product.id);

        handleOpenModal();
    }

    const handleDelete = async (id: number) => {
        try {
            const button = await Swal.fire({
                title: 'คุณต้องการลบรายการนี้หรือไม่?',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            });

            if (button.isConfirmed) {
                await axios.delete(`${config.apiUrl}/buy/remove/${id}`);
                fetchData();
            }
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'ผิดพลาด',
                text: error.message,
            });  
        }
    }

    const handleClear = () => {
        setSerial('');
        setName('');
        setRelease('');
        setColor('');
        setPrice(0); 
        setCustomerName('');
        setCustomerPhone('');
        setCustomerAddress('');
        setRemark('');
        setQty(1);
    }

    return (
        <>
            <h1 className="content-header">รายการซื้อ</h1>

            <div>
                <button className="btn" onClick={() => {
                    handleClear(); 
                    handleOpenModal(); 
                }}>
                    <i className="fa-solid fa-plus mr-2"></i>
                    เพิ่มรายการ
                </button>

                <table className="table mt-3">
                    <thead>
                        <tr>
                            <th className="text-left">serial</th>
                            <th className="text-left">ชื่อสินค้า</th>
                            <th className="text-left">รุ่น</th>
                            <th className="text-left">สี</th>
                            <th className="text-right pr-0">ราคา</th>
                            <th className="text-left">ลูกค้า</th>
                            <th className="text-left">เบอร์โทรศัพท์</th>
                            <th className="text-left">หมายเหตุ</th>
                            <th className="w-[110px]"></th> 
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product: any) =>(
                            <tr key={product.id}>
                               <td>{product.serial}</td> 
                               <td>{product.name}</td>
                               <td>{product.release}</td>
                               <td>{product.color}</td>
                               <td className="text-right">{product.price.toLocaleString()}</td>
                               <td>{product.customerName}</td>
                               <td>{product.customerPhone}</td>
                               <td>{product.remark}</td>
                               <td className="text-center">
                                <button className="btn-edit mr-1" onClick={() => handleEdit(product.id)}>
                                    <i className="fa-solid fa-edit"></i>
                                </button>
                                <button className="btn-delete" onClick={() => handleDelete(product.id)}>
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                               </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="mt-5">
                    <div>รายการทั้งหมด {products.length} รายการ</div>
                    <div>หน้า {page} จาก {totalPages}</div>
                    <div className="flex gap-1">
                        <button className="btn" onClick={() => setPage(1)}>
                            <i className="fa-solid fa-caret-left mr-2"></i>
                            หน้าแรก
                        </button>
                        <button className="btn" onClick={() => setPage(page-1)}>
                            <i className="fa-solid fa-caret-left"></i>
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button className="btn" onClick={() => setPage(i+1)} key={i}>
                                {i+1}
                            </button>
                        ))}
                        <button className="btn" onClick={() => setPage(page+1)}>
                            <i className="fa-solid fa-caret-right"></i>
                        </button>
                        <button className="btn" onClick={() => setPage(totalPages)}>
                            หน้าสุดท้าย
                            <i className="fa-solid fa-caret-right ml-2"></i>
                        </button>
                    </div>
                </div>
            </div>
            <Modal title="เพิ่มรายการ" isOpen={isOpen} onClose={handleCloseModal}>
                <div>serial สินค้า</div>
                <input type="text" value={serial} onChange={(e) => setSerial(e.target.value)} />

                <div className="mt-2">ชื่อสินค้า</div>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

                <div className="mt-2">รุ่นสินค้า</div>
                <input type="text" value={release} onChange={(e) => setRelease(e.target.value)} />

                <div className="mt-2">สีสินค้า</div>
                <input type="text" value={color} onChange={(e) => setColor(e.target.value)} />

                <div className="mt-2">ราคาสินค้า</div>
                <input type="text" value={price} onChange={(e) => setPrice(Number(e.target.value))} />

                <div className="mt-2">ชื่อลูกค้า</div>
                <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />

                <div className="mt-2">เบอร์โทรศัพท์</div>
                <input type="text" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />

                <div className="mt-2">ที่อยู่</div>
                <input type="text" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} />

                <div className="mt-2">หมายเหตุ</div>
                <input type="text" value={remark} onChange={(e) => setRemark(e.target.value)} />
                    
                <div className="mt-2">จำนวนสินค้า</div>
                <input type="text" value={qty} onChange={(e) => setQty(Number(e.target.value ?? 0))} />

                <div className="mt-2">
                    <button className="btn" onClick={handleSave}>
                        <i className="fa-solid fa-save mr-2"></i>
                        บันทึก
                    </button>
                </div>
            </Modal>
        </>
    )
}