import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import useFields from './hooks/useFields'
import {
    Button,
    Form,
    FormGroup,
    Input,
    Label,
    Alert
  } from "reactstrap";

const Login = ({loginUser, setOnHomepage}) => {
  setOnHomepage(false);
  const [formData, handleChange] = useFields({
    username: '',
    password: ''
  })

  const [errorHandler, setErrorHandler] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorCheck = await loginUser(formData);
    if (errorCheck) {
      setErrorHandler(true)
    } else {
      return navigate("/trips")
    }
  }
  
  return (
    <div>
        <h2 className="mx-auto col-md-4 mt-5 text-center">Log In</h2>
        <Form className="col-md-4 mt-3 py-4 px-4 container-fluid bg-transparent rounded" onSubmit={handleSubmit}>
            <FormGroup>
                <Label for="username" className="fw-bold">
                Username
                </Label>
                <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                />
            </FormGroup>
            <FormGroup>
                <Label for="Password" className="fw-bold">
                Password
                </Label>
                <Input
                id="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                />
            </FormGroup>
            <div className="d-grid gap-2">
                <Button color="primary">
                    Submit
                </Button>
            </div>
            {errorHandler && <div>
                <Alert className='mt-3 mb-1' color='danger'>
                    Invalid username/password
                </Alert>
            </div>}
        </Form>
    </div>
  )
}

export default Login
