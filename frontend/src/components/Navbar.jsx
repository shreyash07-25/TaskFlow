import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Button from "./ui/Button";
import { LogoutIcon, MoonIcon, SunIcon } from "./ui/Icon";

function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/dashboard" className="navbar__brand">
          <span className="navbar__mark" aria-hidden="true" />
          TaskFlow
        </Link>

        <div className="navbar__actions">
          <Link to="/dashboard" className="navbar__link">
            Dashboard
          </Link>

          <button
            type="button"
            className="navbar__icon-btn"
            onClick={toggleTheme}
            aria-label={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>

          <Button
            variant="secondary"
            size="sm"
            icon={<LogoutIcon width={16} height={16} />}
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
