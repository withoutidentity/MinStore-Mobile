import Link from "next/link"

export default function Sidebar() {
    return(
        <div className="bg-blue-600 h-screen w-64 fixed"> 
            <div className="text-center p-4 bg-blue-800 text-white">
                <h1 className="text-xl mt-1">Menu</h1>
                <div className="flex items-center gap-1 mt-3">  {/* ทำให้มันเรียงซ้ายไปขวา */}
                    <i className="fa fa-user"></i>
                    <span className="w-full ml-1 text-left">Muhaimin Mama</span>
                    <button className="bg-blue-500 rounded-full px-2 py-1">
                        <i className="fa fa-pencil"></i>
                    </button>
                    <button className="bg-red-500 rounded-full px-2 py-1">
                        <i className="fa fa-sign-out-alt"></i>
                    </button>
                </div>
            </div>
            <div className="p-5 text-white text-xl flex flex-col gap-3"> 
                <div>
                    <Link href="/backoffice/dashboard">
                        <i className="fa fa-tachometer-alt mr-2 w-[25px] text-center"></i>
                        Dashboard
                    </Link>
                </div>
                <div>
                    <Link href="/backoffice/buy">
                        <i className="fa fa-shopping-cart mr-2 w-[25px] text-center"></i>
                        ซื้อสินค้า
                    </Link>
                </div>
                <div>
                    <Link href="/backoffice/sell">
                        <i className="fa fa-dollar-sign mr-2 w-[25px] text-center"></i>
                        ขายสินค้า
                    </Link>
                </div>
                <div>
                    <Link href="/backoffice/repair">
                        <i className="fa fa-wrench mr-2 w-[25px] text-center"></i>
                        รับซ่อม
                    </Link>
                </div>
                <div>
                    <Link href="/backoffice/company">
                        <i className="fa fa-building mr-2 w-[25px] text-center"></i>
                        ข้อมูลร้าน
                    </Link>
                </div>
                <div>
                    <Link href="/backoffice/user">
                        <i className="fa fa-users mr-2 w-[25px] text-center"></i>
                        ผู้ใช้งาน
                    </Link>
                </div>
            </div>
        </div>
    )
}