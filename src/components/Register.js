import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";

const Register = () => {
  const navigate = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */



  const apiCall = async () => {
    try {
      const data = { username, password};
      const response = await axios({
        method: 'post',
        url: `${config.endpoint}/auth/register`,
        data,
        headers: { "Content-type": "application/json" },
      });
      if (response.status === 201) {
        setUsername('');
        setPassword('');
        setConfirmPassword('')
        enqueueSnackbar("Success", { variant: "success" })
        navigate.push('/login', {from: 'register'})
        return;
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        enqueueSnackbar(err.response.data.message, { autoHideDuration: 3000, variant: 'error' });
      }
      else {
        enqueueSnackbar('Something went wrong. Check that the backend is running, reachable and returns valid JSON.', { autoHideDuration: 3000, variant: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  }

  const register = async () => {
    if (validateInput()) {
      setIsLoading(true);
      await apiCall();
    }

  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = () => {
    if (!username) {
      enqueueSnackbar("Username is a required field", {autoHideDuration: 3000, variant: "warning" });
      return false;
    }
    if (username.length < 6) {
      enqueueSnackbar("Username must be at least 6 characters", {
        variant: "warning",
      });
      return false;
    }
    if (!password) {
      enqueueSnackbar("Password is a required field", {autoHideDuration: 3000, variant: "warning" });
      return false;
    }
    if (password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", {
        autoHideDuration: 3000,
        variant: "warning",
      });
      return false;
    }
    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", {autoHideDuration: 3000, variant: "warning" });
      return false;
    }
    return true;
  };

  const hasHiddenAuthButtons = true;
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons={hasHiddenAuthButtons} />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Username"
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            fullWidth
          />
          {
            isLoading ?
              <Box sx={{ textAlign: 'center', m: 1 }}><CircularProgress /> </Box> :
              <Button className="button" variant="contained" onClick={register}>
                Register Now
              </Button>
          }
          <p className="secondary-action">
            Already have an account?{" "}
            <Link to="/login" style={{textDecoration: 'none'}}>
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
