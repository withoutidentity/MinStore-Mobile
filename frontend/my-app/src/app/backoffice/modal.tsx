// modal component
'use client'

interface ModalProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean; //ไว้เปิดกล่อง
    onClose: () => void; //ไว้ปิดกล่อง
}

export default function Modal({ title, children, isOpen, onClose}: ModalProps) {
    return (
        isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white rounded-lg shadow-lg w-1/2">
                    <h2 className="text-xl mb-4 bg-blue-600 text-white p-4 rounded-t-lg">
                        {title}
                        <button className="float-right text-gray-300" onClick={onClose}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </h2>
                <div className="mt-4 p-5">
                    {children}
                </div>
            </div>
        </div>
        )
    )
}