import {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { useAddNewNoteMutation } from './notesApiSlice'

const initForm = {
    user: "",
    title: "",
    text: ""
}
export default function NewNoteForm({users}) {
    const [formData, setFormData] = useState(initForm)
    const [validData, setValidData] = useState({
        validUser: false,
        validTitle: false,
        validText: false,
    })
    const [addNewNote, {isLoading, isSuccess, isError, err}] = useAddNewNoteMutation()
    const navigate = useNavigate()
    function change(e) {
        const {name, value} = e.target;
        
        setFormData({...formData, [name]: value})
        if (name === "user" && value.length > 3) {
            setValidData({...validData, validUser: true})
        } else if (name === "title" && value.split("").length >= 3) {
            setValidData({...validData, validTitle: true})
        } else if (name === 'text' && value.split('').length >= 3) {
            setValidData({...validData, validText: true})
        }
    }

    const validUserClass = !validData.validUser ? 'form__input--incomplete' : ''
    
    const usersSelect = users ?
    (<label className='form__label'>
        User:
     <select name='user' onChange={change} className={`form__input ${validUserClass}`}>
        {users.map((usr, idx) => {
            return <option key={idx} value={usr.id}>{usr.username}</option>
        })}
        </select> 
    </label>) : <p>Loading...</p>
     const errClass = isError ? "errmsg" : "offscreen"
     const validTitleClass = !validData.validTitle ? 'form__input--incomplete' : ''
     const validTextClass = !validData.validText ? 'form__input--incomplete' : ''
     const cansave = [validData.validUser, validData.validTitle, validData.validText].every(Boolean) && !isLoading
        async function submit(e) {
            e.preventDefault()
            if (cansave) {
                await addNewNote(formData)
                navigate("/dash")
            }
        }
        const content = (
            <>
            <p className={errClass}>{err?.data?.message}</p>
            <form className='form' onSubmit={submit}>
                <div className='form__title-row'>
                    <h2>New Note</h2>
                    <div className='form__action-buttons'>
                        <button className='icon-button' title="Save"><FontAwesomeIcon icon={faSave} /></button>
                    </div>
                </div>
                {usersSelect}
                <label className='form__label' htmlFor='title'>Title: <span className='nowrap'>[3-50 chars incl. !@#$%]</span></label>
                <input type='text' name='title' value={formData.title} onChange={change} id='title' className={`form__input ${validTitleClass}`} />
                <label className='form__label' htmlFor='text'>Note: <span className='nowrap'>[3-50 chars incl. !@#$%]</span></label>
                <input type='text' name='text' value={formData.text} onChange={change} id='text' className={`form__input ${validTextClass}`} />
            </form>
            </>
        )
        return content


}
