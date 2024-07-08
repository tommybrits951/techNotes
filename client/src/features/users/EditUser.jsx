import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectUserById } from "./userApiSlice"
import EditUserForm from "./EditUserForm"

export default function EditUser() {
  const {id} = useParams()
  const user = useSelector(state => selectUserById(state, id))
  const content = user !== null ? <EditUserForm user={user} /> : <p>Loading...</p>
  useEffect(() => {
    console.log(user)
  }, [])
  return content
}
