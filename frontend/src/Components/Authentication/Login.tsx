import React, { useState } from "react";
import { useLoginMutation } from "../../api/auth";
import { useDispatch } from "react-redux";
import { setToken } from "../../redux/user";

interface initialForm {
  username?: string;
  password?: string;
}

interface TokenInterface {
  access_token: string;
  token_type: string;
}

/**
 *  Component, Form for logining in an user.
 *
 * Props:
 *
 * State:
 *  formData: data input from form. Matches initial state fields
 *
 * RouteList -> LoginForm
 */
function LoginForm() {
  const [login] = useLoginMutation();
  const [error, setError] = useState<null | string>(null);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<initialForm>({
    username: "",
    password: "",
  });

  /** handleChange: Handles change of form field.*/
  function handleChange(evt: React.FormEvent<HTMLInputElement>) {
    const { name, value } = evt.target as HTMLInputElement;
    setFormData((oldData) => ({ ...oldData, [name]: value }));
  }

  /** handleSubmit: Handles submission of form. Creates or updates profile.*/
  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    try {
      const token: TokenInterface = await login(formData).unwrap();
      setFormData({ username: "", password: "" });
      dispatch(setToken({ token }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (typeof err.data.detail === "string") {
        setError(err.data.detail);
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-Raleway text-2xl font-semibold text-dark-500">
        Login
      </h2>
      {error && <p className="text-red-600">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-center justify-between gap-4 border-b-2"
      >
        <div className="field">
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            className="input"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            className="input"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn-primary m-8">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
