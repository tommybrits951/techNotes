import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectNoteById } from "./notesApiSlice";

export default function Note({ noteId }) {
  const note = useSelector((state) => selectNoteById(state, noteId));

  const navigate = useNavigate();

  if (note) {
    const created = new Date(note.createdAt).toLocaleString('en-US', {day: 'numeric', month: 'long'})
    const updated = new Date(note.updatedAt).toLocaleString('en-US', {day: 'numeric', month: 'long'})
    const handleEdit = () => navigate(`/dash/notes/${noteId}`);
    const complete = note.completed ? "Completed" : "Open"
    return (
      <tr className="table__row">
        <td className="table__cell note__status">{complete}</td>
        <td className={"table__cell note__created"}>{created}</td>
        <td className={"table__cell note__updated"}>{updated}</td>
        <td className={"table__cell note__title"}>{note.title}</td>
        <td className={"table__cell note__username"}>{note.username}</td>
        <td className={"table__cell"}>
          <button onClick={handleEdit} className="icob-button table__button">
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    )
  } else return null;
}
