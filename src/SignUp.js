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

const Signup = ({registerUser, setOnHomepage}) => {
  setOnHomepage(false);
  const [formData, handleChange] = useFields({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: ''
  })

  const [errorHandler, setErrorHandler] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorCheck = await registerUser(formData);
    if (errorCheck) {
      setErrorHandler(errorCheck)
    } else {
      return navigate("/trips")
    }
  }
  
  return (
    <div>
        <h2 className="mx-auto col-md-4 mt-5 text-center">Sign Up</h2>
        <Form className="col-md-4 mt-3 py-4 px-4 container-fluid bg-transparent rounded" onSubmit={handleSubmit}>
            <FormGroup>
                <Label for="username" className="fw-bold">
                Username
                </Label>
                <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                type="text"
                />
            </FormGroup>
            <FormGroup>
                <Label for="Password" className="fw-bold">
                Password
                </Label>
                <Input
                id="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                />
            </FormGroup>
            <FormGroup>
                <Label for="firstName" className="fw-bold">
                First Name
                </Label>
                <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                type="text"
                />
            </FormGroup>
            <FormGroup>
                <Label for="lastName" className="fw-bold">
                Last Name
                </Label>
                <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                type="text"
                />
            </FormGroup>
            <FormGroup>
                <Label for="email" className="fw-bold">
                Email
                </Label>
                <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                />
            </FormGroup>
            <div className="d-grid gap-2">
                <Button color="primary">
                    Submit
                </Button>
            </div>
            {errorHandler && <div>
                <Alert className='mt-3 mb-1' color='danger'>
                    {errorHandler[0]}
                </Alert>
            </div>}
        </Form>
    </div>
  )
}

export default Signup
