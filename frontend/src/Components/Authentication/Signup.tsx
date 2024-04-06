import React, {  useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useSignupMutation } from "../../api/auth";
import { setToken } from "../../redux/user";
import { useDispatch } from "react-redux";


interface initialForm {
        password: string,
        first_name: string,
        last_name: string,
        email: string
    }

const initialState = {
    password: "",
    first_name: "",
    last_name: "",
    email: ""
};

interface TokenInterface {
    access_token: string
    token_type: string
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
    const navigate = useNavigate();
    const [formData, setFormData] = useState<initialForm>(initialState);
    const [signup, {isLoading}] = useSignupMutation()
    const dispatch = useDispatch()


    /** handleChange: Handles change of form field.*/
    function handleChange(evt : React.FormEvent<HTMLInputElement>) {
        const { name , value } = evt.target as HTMLInputElement
        setFormData(oldData => ({...oldData ,[name]:value}));
    }

    /** handleSubmit: Handles submission of form. Creates or updates profile.*/
    async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        try {
            console.log(formData)
            const token: TokenInterface = await signup(formData).unwrap();
            setFormData(initialState);
            navigate("/");
            dispatch(setToken({token}))
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
                htmlFor="email">Email</label>
            <input type="email"
                className="input"
                name="email"
                value={formData.email}
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
            <div className="field">
            <label 
                className="label"
                htmlFor="first_name">First Name</label>
            <input type="first_name"
                className="input"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
            />
            </div>

            <div className="field">
            <label className="label" htmlFor="last_name">Last Name</label>
            <input type="last_name"
                className="input"
                name="last_name"
                value={formData.last_name}
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