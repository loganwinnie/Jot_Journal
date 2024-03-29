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
 *  signup: Function for signup a user.
 *  displayErrors: Function for setting errors
 * 
 * State: 
 *  formData: data input from form. Matches initial state fields
 * 
 * RouteList -> LoginForm
 */
function SignupForm() {

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
            // await signup(formData);
            setFormData(initialState);
            navigate("/create-profile");
        } catch (errs) {
            console.log(errs)
            if (errs instanceof Array) {
                // displayErrors(errs)
            }
        }
    }

  return (  
    <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-Raleway font-semibold text-dark-500 mb-4">Signup</h2>

        <form onSubmit={handleSubmit} 
            className="border-b-2 flex flex-col items-center justify-between gap-4 w-full">
            <div className="field">
            <label 
                className="label"
                htmlFor="firstName">First Name</label>
            <input type="firstName"
                className="input"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
            />
            </div>

            <div className="field">
            <label className="label" htmlFor="lastName">Last Name</label>
            <input type="lastName"
                className="input"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
            />
            </div>

            <div className="field">
            <label 
                className="label"
                htmlFor="email">Email</label>
            <input type="email"
                className="input"
                name="email"
                value={formData.username}
                onChange={handleChange}
                required
            />
            </div>

            <div className="field">
            <label 
                className="label"
                htmlFor="password">Password</label>
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
                className="btn-primary m-8">Sign up</button>
        </form>
        </div>
  );
}


export default SignupForm;