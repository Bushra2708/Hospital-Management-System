import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="auth-bg">
        <div className="auth-orb" />
      </div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
