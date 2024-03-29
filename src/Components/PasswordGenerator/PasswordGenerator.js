import React, { useState, useEffect } from "react";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Button,
  Typography,
  Snackbar,
  Box,
  useMediaQuery,

} from "@mui/material";
import { Alert } from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { useNavigate, useLocation } from "react-router-dom";

import {
  numbers,
  upperCaseLetters,
  lowerCaseLetters,
  specialCharacters,
} from "../../config/Character";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useSelector } from "react-redux";


const PasswordGenerator = () => {
  const [password, setPassword] = useState("");
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUpperCase, setIncludeUpperCase] = useState(true);
  const [includeLowerCase, setIncludeLowerCase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState(true);
  const desktop = useMediaQuery("(min-width:600px)");
  const galaxyFold = useMediaQuery("(max-width: 320px)");
  const darkMode = useSelector(state => state.theme.darkMode);

  const navigate = useNavigate();
  const location = useLocation();

  const handleGeneratePassword = () => {
    if (
      !includeUpperCase &&
      !includeLowerCase &&
      !includeNumbers &&
      !includeSymbols
    ) {
      setOpenSnackbar(true);
      setError(true);
      return;
    }

    let characterList = "";
    if (includeNumbers) {
      characterList += numbers;
    }
    if (includeUpperCase) {
      characterList += upperCaseLetters;
    }
    if (includeLowerCase) {
      characterList += lowerCaseLetters;
    }
    if (includeSymbols) {
      characterList += specialCharacters;
    }

    setPassword(createPassword(characterList, passwordLength));
    setShowPassword(true);
  };

  const handleResetPassword = () => {
    setShowPassword(false);
    setPassword("");
  };

  const createPassword = (characterList, length) => {
    let generatedPassword = "";
    const characterListLength = characterList.length;

    for (let i = 0; i < length; i++) {
      const characterIndex = Math.floor(Math.random() * characterListLength);
      generatedPassword += characterList.charAt(characterIndex);
    }

    return generatedPassword;
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setOpenSnackbar(true);
      setError(false);
    } catch (error) {
      setOpenSnackbar(true);
      setError(true);
    }
  };

  const handleCopyPassword = () => {
    if (password === "") {
      setOpenSnackbar(true);
      return;
    }

    copyToClipboard(password);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    const handleBackButton = () => {
      navigate("/passwordgenerator");
    };

    if (location.pathname === "/passwordgenerator") {
      window.history.pushState(null, "", "/passwordgenerator");
      window.addEventListener("popstate", handleBackButton);
    }

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [location, navigate]);

  return (
    <Grid   container justifyContent="center" alignItems="center" height="100vh">
      <Grid  item xs={12} md={6}>
        <Box
          p={4}
          boxShadow={3}
          marginTop="10%"
          borderRadius={4}
          bgcolor="white"
          paddingBottom="50px"
          sx={{ bgcolor: darkMode ? '#222' : '#fff' }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Password Generator
          </Typography>
          <FormGroup>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel color="secondary" htmlFor="password-length">
                Password length
              </InputLabel>
              <OutlinedInput
                id="password-length"
                type="number"
                color="secondary"
                value={passwordLength}
                onChange={(e) =>
                  setPasswordLength(
                    Math.max(8, Math.min(26, parseInt(e.target.value, 10)))
                  )
                }
                endAdornment={
                  <InputAdornment position="end">
      <IconButton
        onClick={() =>
          setPasswordLength((prev) => Math.max(8, prev - 1))
        }
        color="secondary"
        edge="end"
        size="large"
      >
        <RemoveIcon />
      </IconButton>
      characters
      <IconButton
        onClick={() =>
          setPasswordLength((prev) => Math.min(26, prev + 1))
        }
        color="secondary"
        edge="end"
        size="large"
      >
        <AddIcon />
      </IconButton>
    </InputAdornment>
                }
                label="Password length"
              />
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={includeUpperCase}
                  onChange={() => setIncludeUpperCase((prev) => !prev)}
                />
              }
              label="Uppercase Letters"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={includeLowerCase}
                  onChange={() => setIncludeLowerCase((prev) => !prev)}
                />
              }
              label="Lowercase Letters"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={includeNumbers}
                  onChange={() => setIncludeNumbers((prev) => !prev)}
                />
              }
              label="Numbers"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={includeSymbols}
                  onChange={() => setIncludeSymbols((prev) => !prev)}
                />
              }
              label="Symbols"
            />
          </FormGroup>
          <Box mt={4}  sx={galaxyFold ? {height: "50px", flexDirection: "column"} : ""}  display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleGeneratePassword}
              sx={{marginBottom: galaxyFold ? "10px" : ""}}
            >
              Generate Password
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleResetPassword}
              sx={{marginBottom: galaxyFold ? "10px" : ""}}
            >
              Reset Password
            </Button>
          </Box>
          {showPassword && (
            <Box
              mt={4}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6">{password}</Typography>
              <IconButton color="secondary" onClick={handleCopyPassword}>
                <FileCopyIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      </Grid>
      <Snackbar
        anchorOrigin={{
          vertical: desktop ? "bottom" : "top",
          horizontal: "center",
        }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={!error ? "success" : "error"}
        >
          {!includeUpperCase &&
            !includeLowerCase &&
            !includeNumbers &&
            !includeSymbols &&
            error &&
            "To generate a password, you must select at least one checkbox."}
          {!error && "Password Copied To Clipboard"}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default PasswordGenerator;
