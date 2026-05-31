import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const colorVariants = {
  blue: { gradient: "var(--gradient-admin)", shadow: "var(--shadow-blue)", cls: "stat-card-blue" },
  green: { gradient: "var(--gradient-success)", shadow: "var(--shadow-emerald)", cls: "stat-card-green" },
  coral: { gradient: "var(--gradient-danger)", shadow: "none", cls: "stat-card-coral" },
  violet: { gradient: "var(--gradient-receptionist)", shadow: "var(--shadow-violet)", cls: "stat-card-violet" },
  amber: { gradient: "var(--gradient-danger)", shadow: "none", cls: "stat-card-coral" },
};

const useCountUp = (target, duration = 1500) => {
  const [count, setCount] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    const numeric = parseFloat(String(target).replace(/[^0-9.]/g, "")) || 0;
    const start = Date.now();
    const step = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(numeric * eased));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return count;
};

const StatCard = ({ title, value, icon: Icon, color = "blue", subtitle, prefix = "", suffix = "" }) => {
  const variant = colorVariants[color] || colorVariants.blue;
  const numericValue = parseFloat(String(value).replace(/[^0-9.]/g, "")) || 0;
  const isNumeric = !isNaN(numericValue) && value !== "";
  const count = useCountUp(numericValue);

  const displayValue = isNumeric
    ? `${prefix}${count.toLocaleString()}${suffix}`
    : value;

  return (
    <motion.div
      className={`stat-card ${variant.cls}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -3 }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>
            {title}
          </p>
          <h2
            style={{
              fontSize: 30,
              fontWeight: 700,
              fontFamily: "Poppins, sans-serif",
              background: variant.gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1.1,
            }}
          >
            {displayValue}
          </h2>
          {subtitle && (
            <p style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 6 }}>
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: variant.gradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: variant.shadow,
              opacity: 0.9,
            }}
          >
            <Icon size={22} color="white" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;