// src/ui/Toast.jsx
import React, { useState, useEffect, createContext, useContext } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

// Context để quản lý toast
const ToastContext = createContext();

// Hook để sử dụng toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

// Toast Item Component
const ToastItem = ({ id, type, message, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(id), 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [id, onRemove]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(id), 300);
  };

  const configMap = {
    success: {
      icon: CheckCircle,
      bg: "bg-green-50",
      border: "border border-green-200",
      iconColor: "text-green-600",
      textColor: "text-green-800",
    },
    error: {
      icon: XCircle,
      bg: "bg-red-50",
      border: "border border-red-200",
      iconColor: "text-red-600",
      textColor: "text-red-800",
    },
    info: {
      icon: Info,
      bg: "bg-blue-50",
      border: "border border-blue-200",
      iconColor: "text-blue-600",
      textColor: "text-blue-800",
    },
  };

  const config = configMap[type] || configMap.info;
  const Icon = config.icon;

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-sm 
        ${config.bg} ${config.border} 
        transition-all duration-300 min-w-[300px] max-w-md
        ${
          isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"
        }
      `}
    >
      <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0`} />
      <p
        className={`flex-1 text-sm font-medium leading-none ${config.textColor}`}
      >
        {message}
      </p>
      <button
        onClick={handleClose}
        className={`ml-2 p-1 rounded hover:bg-green-100/50 ${config.iconColor}`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }
      `}</style>
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const toast = {
    success: (message) => addToast("success", message),
    error: (message) => addToast("error", message),
    info: (message) => addToast("info", message),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};
