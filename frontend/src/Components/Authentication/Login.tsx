import React, {useState } from "react";
import {useNavigate } from 'react-router-dom';
import { useLoginMutation } from "../../api/auth";
import { useDispatch } from "react-redux";
import { setToken } from "../../redux/user";

interface initialForm {
    username?: string, password?: string
}

interface TokenInterface {
        access_token: string
        token_type: string
  } 



/**
 *  Component, Form for logining in an user.
 *
 * Props:
 * login: Function for user login.
 * 
 * State: 
 *  errors: Array of error objects created when submitting form.
 *  formData: data input from form. Matches initial state fields
 * 
 * RouteList -> LoginForm
 */
function LoginForm() {
  const navigate = useNavigate();
  const [login, {isLoading}] = useLoginMutation()
  const dispatch = useDispatch()


  const [formData, setFormData] = useState<initialForm>({
    username: "", 
    password: ""});
//   const [errors, setErrors] = useState<null | Array<string>>(null);

  /** handleChange: Handles change of form field.*/
  function handleChange(evt : React.FormEvent<HTMLInputElement>) {
    const { name , value } = evt.target as HTMLInputElement
    setFormData(oldData => ({...oldData ,[name]:value}));
  }

  /** handleSubmit: Handles submission of form. Creates or updates profile.*/
  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    try {
      const token: TokenInterface = await login(formData).unwrap();
      setFormData({ username: "", password: "" });
      dispatch(setToken({token}))
    } catch (err) {
        if (err instanceof Array) {
        //   setErrors(err);
        }
    }
  }

  return (
      <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-Raleway font-semibold text-dark-500">Login</h2>
        <form onSubmit={handleSubmit}
          className="border-b-2 flex flex-col items-center justify-between gap-4 w-full">
          <div className="field">
            <label className="label" htmlFor="email" >Email</label>
            <input  
              className="input"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="password" >Password</label>
            <input type="password"
              className="input"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button 
            type="submit"
            className="btn-primary m-8">Login</button>
        </form>
      </div>
);
}

export default LoginForm;