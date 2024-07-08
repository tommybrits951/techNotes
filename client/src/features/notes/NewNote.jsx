import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/userApiSlice";
import NewNoteForm from "./NewNoteForm";

export default function NewNote() {
  const users = useSelector(selectAllUsers)
  const content = users ? <NewNoteForm users={users} /> : <p>Loading...</p>
  return content
}
