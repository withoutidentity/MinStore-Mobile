'use client'

import { useEffect, useState } from "react"
import axios from "axios"
import { config } from "@/app/congig"
import dayjs from "dayjs"
import { useSearchParams } from "next/navigation"

export default function Page() {
    // รับค่า id จาก query string
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [sell, setSell] = useState<any>(null);

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async (): Promise<void> => {
        const res = await axios.get(`${config.apiUrl}/sell/info/${id}`);
        setSell(res.data)
        printDocument()
    }

    const printDocument = () => {
        // css rules สำหรับการพิมพ์
        const style = document.createElement('style');
        style.textContent = `
            @media print {
                body * {
                    visibility: hidden;
                }
                #print-content,
                #print-content * {
                    visibility: visible;
                }
                #print-content {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 80mm;
                    height: 100%;
                }
                .content-header {
                    display: none;
                }
            }
        `
        document.head.appendChild(style)

        //print
        setTimeout(() => {
            window.print()
        }, 300)
    }

    return (
        <div>
            <div className="content-header flex justify-between">
                <div>พิมพ์บิล</div>
                <div>
                    <button className="btn btn-primary text-xl" onClick={printDocument}>
                        <i className="fa-solid fa-print mr-3"></i>
                        พิมพ์บิล
                    </button>
                </div>
            </div>
            <div id="print-content">
                <div className="text-2xl font-bold text-center">ใบเสร็จรับเงิน</div>
                <div className="text-left">วันที่ {dayjs(sell?.payDate).format('DD/MM/YYYY')}</div>
                <div className="text-left">รายการ: {sell?.product.name}</div>
                <div className="text-left">ราคา: {sell?.price.toLocaleString()}</div>
                <div className="text-left">วันที่ออกบิล: {dayjs(sell?.payDate).format('DD/MM/YYYY')}</div>
            </div>

        </div>
    )
}