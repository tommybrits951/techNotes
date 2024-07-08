import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserById, selectUserIds } from "./userApiSlice";

export default function User({ userId }) {
  const user = useSelector((state) => selectUserById(state, userId));

  const navigate = useNavigate();

  if (user) {
    const handleEdit = () => navigate(`/dash/users/${userId}`);
    const userRolesString = user.roles.toString().replaceAll(",", ", ");
    const cellStatus = user.active ? "" : "table_cell--inactive";
    return (
      <tr>
        <td className={`${cellStatus} table__cell`}>{user.username}</td>
        <td className={`${cellStatus} table__cell`}>{userRolesString}</td>
        <td className={`${cellStatus} table__cell`}>
          <button onClick={handleEdit} className="icon-button table__button">
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  } else return null;
}
