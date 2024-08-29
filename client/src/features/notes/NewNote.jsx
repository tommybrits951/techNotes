import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/userApiSlice";
import NewNoteForm from "./NewNoteForm";

export default function NewNote() {
  const users = useSelector(selectAllUsers)
  if (!users?.length) return <p>Not Currently Availible</p>
  const content = users ? <NewNoteForm users={users} /> : <p>Loading...</p>

  return content
}
