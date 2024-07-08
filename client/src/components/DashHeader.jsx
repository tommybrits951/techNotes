import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";

const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\dash\/notes(\/)?$/;
const USERS_REGEX = /^\dash\/users(\/)?$/;

export default function DashHeader() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);

  if (isLoading) return <p>Logging Out...</p>;
  if (isError) return <p>Error: {error.data?.message}</p>;
  let dashClass = null;
  if (
    !DASH_REGEX.test(pathname) &&
    !NOTES_REGEX.test(pathname) &&
    !USERS_REGEX.test(pathname)
  ) {
    dashClass = "dash-header__container--small";
  }
  const logOutButton = (
    <button className="icon-button" title="Logout" onClick={sendLogout}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  );

  const content = (
    <header className="dash-header">
      <div className={`dash-header__container ${dashClass}`}>
        <Link to="/dash">
          <h1 className="dash-header__title">TechNotes</h1>
        </Link>
        <nav className="dash-header__nav">
          {logOutButton}
          {/* add more btns later*/}
        </nav>
      </div>
    </header>
  );
  return content;
}
