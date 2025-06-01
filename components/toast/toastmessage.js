import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ToastMessage({ message, type = "info", timestamp }) {
    const [isVisible, setIsVisible] = useState(true);

        const typeStyles = {
        success: {
            border: "border-green-500",
            bg: "bg-green-100 dark:bg-green-700",
            text: "text-green-800 dark:text-green-100"
        },
        error: {
            border: "border-black-800",
            bg: "bg-red-100 dark:bg-red-700",
            text: "text-red-800 dark:text-red-100"
        },
        warning: {
            border: "border-yellow-500",
            bg: "bg-yellow-100 dark:bg-yellow-600",
            text: "text-yellow-800 dark:text-yellow-100"
        },
        info: {
            border: "border-blue-500",
            bg: "bg-blue-100 dark:bg-blue-700",
            text: "text-blue-800 dark:text-blue-100"
        }
    };

      const currentStyle = typeStyles[type] || typeStyles.info;

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);

        }, 5000); 

        return () => clearTimeout(timer); 

    }, [timestamp, message, type]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                   className={`fixed top-10 left-1/2 -translate-x-1/2 rounded-2xl shadow-xl p-4 flex items-center space-x-3 z-50
                    ${currentStyle.bg} ${currentStyle.border}`}
                >
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{message}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
