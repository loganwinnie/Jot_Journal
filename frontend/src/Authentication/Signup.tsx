import React, {  useState } from "react";
import { useNavigate } from 'react-router-dom';


interface initialForm {
        password: string,
        firstName: string,
        lastName: string,
        username: string
    }

/**
 *  Component, Form for signing up an user.
 *
 * Props:
 * signup: Function for signup a user.
 * 
 * State: 
 *  errors: Array of error objects created when submitting form.
 *  formData: data input from form. Matches initial state fields
 * 
 * RouteList -> LoginForm
 */
function SignupForm({ signup, displayErrors }:  { 
    signup: (FormData: initialForm) => void, displayErrors: (errors: {message:string}[]) => void}) {

    const initialState = {
        password: "",
        firstName: "",
        lastName: "",
        username: ""
    };

    const navigate = useNavigate();
    const [formData, setFormData] = useState<initialForm>(initialState);


    /** handleChange: Handles change of form field.*/
    function handleChange(evt : React.FormEvent<HTMLInputElement>) {
        const { name , value } = evt.target as HTMLInputElement
        setFormData(oldData => ({...oldData ,[name]:value}));
    }

    /** handleSubmit: Handles submission of form. Creates or updates profile.*/
    async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        try {
            await signup(formData);
            setFormData(initialState);
            navigate("/create-profile");
        } catch (errs) {
            console.log(errs)
            if (errs instanceof Array) {
                displayErrors(errs)
            }
        }
    }

  return (  
        <form onSubmit={handleSubmit} 
            className="">
            <div className="">
            <label 
                className=""
                htmlFor="firstName">First Name</label>
            <input type="firstName"
                className=""
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
            />
            </div>

            <div className="">
            <label className="" htmlFor="lastName">Last Name</label>
            <input type="lastName"
                className=" "
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
            />
            </div>

            <div className="">
            <label 
                className=""
                htmlFor="email">Email</label>
            <input type="email"
                className=""
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            </div>

            <div className="">
            <label 
                className=""
                htmlFor="phoneNumber">Phone #</label>
            <input className=""
                placeholder="(optional)"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
            />
            </div>

            <div className=" ">
            <label 
                className=" "
                htmlFor="password">Password</label>
            <input type="password"
                className="" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            </div>

            <button 
                type="submit" 
                className="">Sign up</button>
        </form>
  );
}


export default SignupForm;