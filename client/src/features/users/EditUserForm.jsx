import { useState, useEffect } from "react";
import { useUpdateUserMutation, useDeleteUserMutation } from "./userApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

export default function EditUserForm(props) {
  const { user } = props;
    const [error, setError] = useState("")
  const [formData, setFormData] = useState(user ?
     {
         username: user.username,
         id: user.id,
         roles: [...user.roles],
         password: "",
         active: user.active
        } : null
  );
  const [validData, setValidData] = useState(false);
  
  const [updateUser, { isLoading, isSuccess, isError, err }] =
    useUpdateUserMutation();
  const [
    deleteUser,
    { isSuccess: isDelSuccess, isError: isDelError, err: delerr },
  ] = useDeleteUserMutation();

  const navigate = useNavigate();

  useEffect(() => {
    setValidData(USER_REGEX.test(formData.username));
  }, [formData.username]);
  useEffect(() => {
    setValidData(PWD_REGEX.test(formData.password));
  }, [formData.password]);
  
  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setFormData({ username: "", password: "", roles: [] });
      navigate("/dash/users");
    }
  }, [isDelError, isSuccess, navigate]);

  let canSave;
  const onRolesChanged = (e) => {
    const { value } = e.target;
    setValidData(true)
    let chk = false;
    for (let i = 0; i < formData.roles.length; i++) {
      if (formData.roles[i] === value) {
        chk = true;
      }
    }
    if (chk) {
      let arr = [];
      formData.roles.map((rl) => {
        if (rl !== value) {
          arr = [...arr, rl];
        }
      });
      setFormData({ ...formData, roles: arr });
    } else {
      setFormData({ ...formData, roles: [...formData.roles, value] });
    }
    console.log(formData.roles);
  };
  if (formData.password) {
    canSave =
      [
        validData
        
      ].every(Boolean) && !isLoading;
  } else {
    canSave =
      [validData].every(Boolean) &&
      !isLoading;
  }

  function change(e) {
    const { name, value } = e.target;
    
    setFormData({ ...formData, [name]: value });
  }
  function onActiveChange(e) {
    if (formData.active && e.target.checked) {
        e.target.checked = false
        setFormData({...formData, active: !formData.active});
    } else {
        
        setFormData({...formData, active: !formData.active});
    }
  }
  async function submit(e) {
    e.preventDefault();
    
    if (formData.password && formData.roles.length > 0) {
        setError("")
        await updateUser({ id: formData.id, username: formData.username, password: formData.password, roles: formData.roles, active: formData.active });
    } else if (validData) {
        setError("")
      await updateUser({ id: formData.id, username: formData.username, roles: formData.roles, active: formData.active });
    } else {
        setError("Must Select Role")
    }
  }
  async function onDelete() {
    await deleteUser({ id: user.id });
  }

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validUserClass = !validData.validUsername
    ? "form__input--incomplete"
    : "";
  const validPwdClass = !validData.validPassword
    ? "form__input--incomplete"
    : "";
  

  let errContent = (err?.data?.message || delerr?.data?.message) ?? "";
  const options = Object.values(ROLES).map((role, idx) => {
    return (
        <div key={idx}>
      <label htmlFor={`role${idx}`}>
        {role}
        </label>
        <input
        key={role}
        type="checkbox"
        className={`check`}
        name="roles"
        id={`role${idx}`}
        value={role}
        checked={formData.roles.includes(role) ? true : false}
          
          onChange={onRolesChanged}
          />
          </div>
    );
  }) 
  const content = (
    <>
      <p className={errClass}>{error !== "" ? errContent : error}</p>

      <form className="form" onSubmit={submit}>
        <div className="form__title-row">
          <h2>Edit User</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button className="icon-button" title="Save" >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="username">
          Username: <span className="nowrap">[3-20 letters]</span>
        </label>
        <input
          className={`form__input ${validUserClass}`}
          id="username"
          name="username"
          type="text"
          autoComplete="off"
          value={formData.username}
          onChange={change}
        />

        <label className="form__label" htmlFor="password">
          Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span>
        </label>
        <input
          className={`form__input ${validPwdClass}`}
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={change}
        />
        <div className={` check-div`}>
          <label className="form__label" htmlFor="roles">
            ASSIGNED ROLES:
          </label>
          {options}
        </div>
        <label className="check">
          User Active?
          <input
            type="checkbox"
            onChange={onActiveChange}
            value={formData.active}
            name="active"
            checked={formData.active === true ? true : false}
            className="check"
          />
        </label>
      </form>
    </>
  );

  return content;
}
