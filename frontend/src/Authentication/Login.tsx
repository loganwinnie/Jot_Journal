import React, {useState } from "react";
import {useNavigate } from 'react-router-dom';


interface initialForm {
    email?: string, password?: string
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
function LoginForm({ login }: { login: (FormData: initialForm) => void} ) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<initialForm>({
    email: "", 
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
      await login(formData);
      setFormData({ email: "", password: "" });
      navigate("/events");
    } catch (err) {
        if (err instanceof Array) {
        //   setErrors(err);
        }
    }
  }

  return (
    <div className="mt-16 h-screen w-screen flex flex-col items-center justify-start">
      <h2 className="text-3xl font-bold">Login</h2>
      <form onSubmit={handleSubmit}
        className="grid auto-rows-auto grid-cols-2 gap-4 text-center">
          {/* <div className="col-span-2 w-full">
            {(errors && errors!.length) && <Alert alerts={errors!} type="warning" />}
          </div> */}

        <div className="form-control col-span-2">
          <label className="label-text font-semibold mb-1" htmlFor="email" >Email</label>
          <input  
            className="input input-bordered input-primary"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-control col-span-2">
          <label className="label-text font-semibold mb-1" htmlFor="password" >Password</label>
          <input type="password"
             className="input input-bordered input-primary"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button 
          type="submit"
          className="btn btn-primary mt-3 col-span-2 font-bold w-fill w-96">Login</button>

      </form>
      </div>);
}

export default LoginForm;