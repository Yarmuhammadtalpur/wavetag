import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Document, ModifyResult } from "mongoose";

import { convertToSha512 } from "../utils/hash";
import { CreateUserRequest, UserType } from "../types/user.types";
import User from "../models/user.model";

/**
 * Creates a new user with the provided information if no user with the same email, phone number, or username already exists in the database, and returns a JSON response with the status and user details.
 *
 * @async
 * @function createUser
 * @param {Request} req - The Express Request object containing user information in the request body.
 * @param {Response} res - The Express Response object to send the HTTP response.
 * @throws {Error} Throws an error with a message 'User already Exists' if a user with the same email, phoneNumber, or username already exists.
 * @returns {Promise<void>} A promise that resolves once the user is successfully created and saved to the database. The HTTP response includes a JSON object with a message, status, and user information.
 */
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, full_name, password } = req.body as CreateUserRequest;
  let username = full_name.replace(/[^a-zA-Z0-9]/g, "-").replace(/-{2,}/g, "-");

  const users: UserType[] = await User.find({
    $or: [{ username }],
  }).select("-password");

  if (users.length !== 0) {
    username = username + `${Math.floor(Math.random() * 5000)}`;
  }

  const userExists: UserType | {} = await User.findOne({
    $or: [{ email }],
  }).select("_id");

  if (userExists) {
    res.status(400);
    throw new Error("User already Exists");
  }
  const hashedPassword: string = convertToSha512(password);

  const newUser: UserType = new User({
    username,
    email,
    // phoneNumber,
    full_name,
    // lastName,
    password: hashedPassword,
  });

  await newUser.save();

  res.status(201).json({
    message: "User Created",
    status: "success",
    data: { _id: newUser._id, email, full_name, username },
  });
});

/**
 * Retrieves all users from the database and responds with a JSON object containing the status and user data.
 *
 * @async
 * @function getUsers
 * @param {Request} req - The Express Request object (unused in this function).
 * @param {Response} res - The Express Response object to send the HTTP response.
 * @throws {Error} Throws an error with a message 'Users not found' if no users are found in the database.
 * @returns {Promise<void>} A promise that resolves once the users are successfully retrieved and sent in the HTTP response.
 */
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users: UserType[] = await User.find().select("-password");

  if (users.length === 0) {
    res.status(404);
    throw new Error("Users not found");
  }

  res.status(200).json({ status: "success", data: users });
});

/**
 * Retrieves a user by their unique identifier from the database and responds with a JSON object containing the status and user data.
 *
 * @async
 * @function getUserById
 * @param {Request} req - The Express Request object containing the user ID in the parameters.
 * @param {Response} res - The Express Response object to send the HTTP response.
 * @throws {Error} Throws an error with a message 'User not found' if no user is found with the specified ID.
 * @returns {Promise<void>} A promise that resolves once the user is successfully retrieved and sent in the HTTP response.
 */
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const userId: string = req.params.id;
  const user: UserType | null = (await User.findById(userId).select(
    "-password"
  )) as UserType;

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  res
    .status(200)
    .json({ message: "User found", status: "success", data: user });
});

/**
 * Updates a user's information by their unique identifier in the database and responds with a JSON object containing the status and updated user data.
 *
 * @async
 * @function updateUserById
 * @param {Request} req - The Express Request object containing the user ID and updated user details in the request body.
 * @param {Response} res - The Express Response object to send the HTTP response.
 * @throws {Error} Throws an error with a message 'User not found' if no user is found with the specified ID. Throws an error with messages 'Email already exists', 'Phone number already exists', or 'Username already exists' if the updated user information conflicts with an existing user.
 * @returns {Promise<void>} A promise that resolves once the user is successfully updated and sent in the HTTP response.
 */
export const updateUserById = asyncHandler(
  async (req: Request, res: Response) => {
    const { full_name, email, phoneNumber, userName } = req.body;
    const { id: userId } = req.params;

    const user: UserType | null = (await User.findById(userId).select(
      "-password"
    )) as UserType;

    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }

    if (email || phoneNumber || userName) {
      const existingUser: UserType | null = await User.findOne({
        $or: [
          { email, _id: { $ne: userId } },
          {
            phoneNumber: { $in: [phoneNumber, undefined] },
            _id: { $ne: userId },
          },
          { username: { $in: [userName, undefined] }, _id: { $ne: userId } },
        ],
      });

      if (existingUser) {
        let errorMessage: string = "";

        if (existingUser.email === email) {
          errorMessage = "Email already exists";
        } else if (existingUser.phoneNumber === phoneNumber) {
          errorMessage = "Phone number already exists";
        } else if (existingUser.username === userName) {
          errorMessage = "Username already exists";
        }

        res.status(400);
        throw new Error(errorMessage);
      }
    }

    user.full_name = full_name || user.full_name;
    // user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.username = userName || user.username;
    await user.save();

    res
      .status(200)
      .json({ message: "User updated", status: "success", data: user });
  }
);

/**
 * Deletes a user by their unique identifier from the database and responds with a JSON object containing the status and deleted user data.
 *
 * @async
 * @function deleteUserById
 * @param {Request} req - The Express Request object containing the user ID in the parameters.
 * @param {Response} res - The Express Response object to send the HTTP response.
 * @throws {Error} Throws an error with a message 'User not found' if no user is found with the specified ID.
 * @returns {Promise<void>} A promise that resolves once the user is successfully deleted and sent in the HTTP response.
 */
export const deleteUserById = asyncHandler(
  async (req: Request, res: Response) => {
    const userId: string = req.params.id;

    const deletionResult: ModifyResult<
      Document<unknown, {}, UserType> & UserType & Required<{ _id: string }>
    > = await User.findByIdAndDelete(userId);

    if (!deletionResult) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json({ message: "User deleted", status: "success" });
  }
);
