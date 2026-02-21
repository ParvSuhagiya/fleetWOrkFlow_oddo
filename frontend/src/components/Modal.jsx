import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="glass-card w-full max-w-lg relative z-10 animate-in fade-in zoom-in duration-200 shadow-2xl border border-white/10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
