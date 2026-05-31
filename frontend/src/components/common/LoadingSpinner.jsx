const LoadingSpinner = ({ size = "md", fullPage = false, text = "" }) => {
  const sizeClass = { sm: "spinner-sm", md: "spinner", lg: "spinner-lg" }[size];

  if (fullPage) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-primary)",
          gap: "16px",
          zIndex: 9999,
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "16px",
            background: "var(--gradient-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
            boxShadow: "var(--shadow-blue)",
            animation: "pulse-dot 2s ease-in-out infinite",
          }}
        >
          <span style={{ fontSize: 28 }}>🏥</span>
        </div>
        <div className={sizeClass} />
        {text && (
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 8 }}>
            {text}
          </p>
        )}
      </div>
    );
  }

  return <div className={sizeClass} />;
};

export default LoadingSpinner;
