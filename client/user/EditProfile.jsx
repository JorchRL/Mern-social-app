import {
  Button,
  Card,
  CardActions,
  CardContent,
  Icon,
  makeStyles,
  TextField,
  Typography,
  Avatar,
} from "@material-ui/core";
import FileUpload from "@material-ui/icons/AddPhotoAlternate";
import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { auth } from "../auth/auth-helper";
import { read, update } from "./api-user";

const EditProfile = () => {
  const params = useParams();

  const classes = useStyles();
  const [values, setValues] = useState({
    name: "",
    about: "",
    photo: "",
    password: "",
    email: "",
    open: false,
    error: "",
    redirectToProfile: false,
  });

  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read({ userId: params.userId }, { t: jwt.token }, signal).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          id: data._id,
          name: data.name,
          email: data.email,
          about: data.about,
          error: "",
        });
      }
    });

    return () => {
      abortController.abort();
    };
  }, [params]);

  const clickSubmit = () => {
    // const user = {
    // name: values.name || undefined,
    // email: values.email || undefined,
    // password: values.password || undefined,
    // about: values.about || undefined,
    // };

    let userData = new FormData();
    values.name && userData.append("name", values.name);
    values.email && userData.append("email", values.email);
    values.password && userData.append("password", values.password);
    values.about && userData.append("about", values.about);
    values.photo && userData.append("photo", values.photo);

    update({ userId: params.userId }, { t: jwt.token }, userData).then(
      (data) => {
        if (data && data.error) {
          setValues({ ...values, error: data.error });
        } else {
          // console.log(data._id);
          setValues({ ...values, userId: data._id, redirectToProfile: true });
        }
      }
    );
  };

  const handleChange = (name) => (event) => {
    const value =
      name === "photo" ? event.target.files[0] : event.target.value;

    setValues({ ...values, [name]: value });
  };

  console.log(values.id);
  const photoUrl = values.id
    ? `/api/users/photo/${values.id}?${new Date().getTime()}`
    : "/api/users/defaultPhoto"; // instead of default photo

  if (values.redirectToProfile) {
    return <Navigate to={`/user/${values.userId}`} />;
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant='h6' className={classes.title}>
          Edit Profile
        </Typography>
        {/* Profile picture */}
        <Avatar className={classes.bigAvatar} src={photoUrl} />
        <br />
        <input
          accept='image/'
          onChange={handleChange("photo")}
          type='file'
          id='icon-button-file'
          className={classes.input}
        />
        <label htmlFor='icon-button-file'>
          <Button variant='contained' color='default' component='span'>
            Upload
            <FileUpload />
          </Button>
        </label>
        <span className={classes.filename}>
          {values.photo ? values.photo.name : ""}
        </span>
        <br />
        {/*  */}
        <TextField
          id='name'
          label='name'
          className={classes.textField}
          value={values.name}
          onChange={handleChange("name")}
          margins='normal'
        />
        <br />
        <br />
        <TextField
          id='multiline-flexible'
          label='About'
          multiline
          rows='2'
          value={values.about}
          onChange={handleChange("about")}
          margins='normal'
          className={classes.textField}
        />
        <br />
        <br />
        <TextField
          id='email'
          label='email'
          type='email'
          className={classes.textField}
          value={values.email}
          onChange={handleChange("email")}
          margins='normal'
        />
        <br />
        <br />
        <TextField
          id='password'
          label='password'
          type='password'
          className={classes.textField}
          value={values.password}
          onChange={handleChange("password")}
          margins='normal'
        />
        <br />
        <br />
        {values.error && (
          <Typography
            component='p'
            color='error'
            className={classes.errorContainer}>
            <Icon color='error' className={classes.error}>
              error
            </Icon>
            {" " + values.error}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button
          color='primary'
          variant='contained'
          onClick={clickSubmit}
          className={classes.submit}>
          Submit
        </Button>
      </CardActions>
    </Card>
  );
};

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    textAlign: "center",
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle,
  },
  errorContainer: {
    marginTop: theme.spacing(2),
  },
  error: {
    verticalAlign: "middle",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
  submit: {
    margin: "auto",
    marginBottom: theme.spacing(2),
  },
  input: {
    display: "none",
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: "auto",
  },
  filename: {
    marginLeft: "10px",
  },
}));

export default EditProfile;
