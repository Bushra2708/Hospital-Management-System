const PageHeader = ({ title, subtitle, actions }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 28,
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "var(--text-primary)",
            fontFamily: "Poppins, sans-serif",
            lineHeight: 1.3,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ color: "var(--text-secondary)", marginTop: 4, fontSize: 13.5 }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
