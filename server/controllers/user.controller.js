import User from "../models/user.model";
import errorHandler from "../helpers/dbErrorHandler";

import extend from "lodash/extend";

// POST api/users
const create = async (req, res) => {
  // console.log(req.body);
  const user = new User(req.body);
  // console.log(user);
  try {
    await user.save();
    return res
      .status(200)
      .json({ message: "Succesfully signed up a new User!" });
  } catch (error) {
    return res
      .status(400)
      .json({ error: errorHandler.getErrorMessage(error) });
  }
};

// GET api/users
const list = async (req, res) => {
  try {
    const users = await User.find().select("name email updated created");
    // TO DO define a User.toJSON() in user model
    return res.status(200).json(users);
  } catch (error) {
    return res
      .status(400)
      .json({ error: errorHandler.getErrorMessage(error) });
  }
};

// GET api/users/:userId
const read = (req, res) => {
  // the userByID function has made req.profile available here...
  // But before returning it, lets hide the password hash and its salt,
  // so that an attacker cannot guess the algorithm by trial and error
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;

  return res.json(req.profile);
};

import formidable from "formidable";
import fs from "fs";
// PUT /api/users/:userId
const update = async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Photo could not be uploaded" });
    }

    let user = req.profile;
    user = extend(user, req.body);
    user.updated = Date.now();

    if (files.photo) {
      // console.log(files.photo);
      // the path is in file.photo.filepath now
      user.photo.data = fs.readFileSync(files.photo.filepath);
      user.photo.contentType = files.photo.type;
    }

    try {
      await user.save();
      user.hashed_password = undefined;
      user.salt = undefined;
      res.status(201).json(user);
    } catch (error) {
      return res
        .status(400)
        .json({ error: errorHandler.getErrorMessage(error) });
    }
  });
};

// DELETE /api/users/:userId
const remove = async (req, res, next) => {
  try {
    const user = req.profile;
    // user is the result of User.findById(), so we can call remove() from
    // mongoose Query
    // TODO: replace remove() with deleteOne() as remove() is deprecated
    const deletedUser = await user.remove();
    deletedUser.hashed_password = undefined;
    deletedUser.salt = undefined;
    res.json(deletedUser);
  } catch (error) {
    return res
      .status(400)
      .json({ error: errorHandler.getErrorMessage(error) });
  }
};

// /:userId
const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    req.profile = user;
    next();
  } catch (error) {
    return res.status(400).json({ error: "Could not retrive user" });
  }
};

// GET /api/users/photo/:userId
const photo = async (req, res, next) => {
  // req.profile is available in this controller.
  if (req.profile.photo.data) {
    res.set("Content-Type", req.profile.photo.contentType);
    return res.send(req.profile.photo.data);
  }
  next();
};
// GET /api/users/defaultphoto
import profileImage from "./../../client/assets/images/profile-pic.png";
const defaultPhoto = async (req, res, next) => {
  // return res.sendFile(process.cwd() + profileImage);
  return res.send("");
};

export default {
  list,
  create,
  read,
  update,
  remove,
  userByID,
  photo,
  defaultPhoto,
};
