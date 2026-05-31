import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

const Modal = ({ isOpen, onClose, title, children, footer, size = "md" }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const maxWidths = { sm: "400px", md: "520px", lg: "700px", xl: "900px" };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className="modal-overlay"
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="modal-content"
            style={{ maxWidth: maxWidths[size] || maxWidths.md }}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="modal-header">
              <h3 style={{ fontSize: 17, fontWeight: 600, color: "var(--text-primary)" }}>
                {title}
              </h3>
              <button
                onClick={onClose}
                className="icon-btn"
                style={{ width: 32, height: 32, borderRadius: 8 }}
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="modal-body">{children}</div>

            {/* Footer */}
            {footer && <div className="modal-footer">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
