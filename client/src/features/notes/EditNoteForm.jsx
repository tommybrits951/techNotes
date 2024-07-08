import {useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useUpdateNoteMutation, useDeleteNoteMutation } from './notesApiSlice'
import { useNavigate } from 'react-router-dom'

export default function EditNoteForm({note}) {
  const {title, id, user, text} = note
  const initForm = note ? {
    title, text, id, user
  } : <p>Loading...</p>
  const [formData, setFormData] = useState(initForm)
  const [validData, setValidData] = useState(false)
  const navigate = useNavigate()
  const [updateNote, {isLoading, isSuccess, isError, err}] = useUpdateNoteMutation()
  const [deleteNote, {isDelLoading, isDelSuccess, isDelError, delErr}] = useDeleteNoteMutation()

  function change(e) {
    const {name, value} = e.target;
    setValidData(true)
    setFormData({...formData, [name]: value})
  }

  const cansave = [validData].every(Boolean) && !isLoading
  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setFormData({ title: "", text: "" });
      navigate("/dash/notes");
    }
  }, [isDelError, isSuccess, navigate]);

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validTitleClass = !validData
    ? "form__input--incomplete"
    : "";
  const validTextClass = !validData
    ? "form__input--incomplete"
    : "";
    let errContent = (err?.data?.message || delErr?.data?.message) ?? "";

  async function submit(e) {
    e.preventDefault()
    if (cansave) {
      console.log(formData)
      updateNote(formData)
    }    
  }

    const content = (
      <>
      <p className={errClass}>{err !== "" ? errContent : err}</p>

      <form className="form" onSubmit={submit}>
        <div className="form__title-row">
          <h2>Edit User</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="save" disabled={!cansave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button className="icon-button" title="delete" >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="title">
          Title: <span className="nowrap">[3-20 letters]</span>
        </label>
        <input
          className={`form__input ${validTitleClass}`}
          id="title"
          name="title"
          type="text"
          autoComplete="off"
          value={formData.title}
          onChange={change}
        />

        <label className="form__label" htmlFor="text">
          Text: <span className="nowrap">[4-12 chars incl. !@#$%]</span>
        </label>
        <input
          className={`form__input ${validTextClass}`}
          id="text"
          name="text"
          type="text"
          value={formData.text}
          onChange={change}
        />
        
      </form>
    </>
    )
    return content
}
