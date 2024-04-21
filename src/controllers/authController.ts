import express from 'express'
import { UserModel } from "../models/User";
import { random, authentication } from "../utils/utils";

export const registerUser = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body
    if (!email || !password || !username) {
      return res.status(400).send({ error: "Invalid Request" })
    } 
    const existingUser = await UserModel.findOne({ email: email })
    if (existingUser) {
      return res.status(400).send({ error: "User already existed"})
    }

    const salt: string = random()
    const user = new UserModel({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      }
    })
    await user.save()
    return res.status(200).send({
      user
    })
  } catch (e) {
    return res.status(500).send({
      error: e
    })
  }
}

export const loginUser = async (req: express.Request, res: express.Response) => {
  try {
    const {email, password} = req.body
    if (!email || !password) {
      return res.status(400).send({
        error: "Invalid Request"
      })
    }

    const user = await UserModel.findOne({ email }).select('+authentication.salt +authentication.password')
    if (!user) {
      return res.status(403).send({
        error: "UnAuthorized User"
      })
    }

    const expectedHash = authentication(user.authentication.salt, password)
    if (user.authentication.password !== expectedHash) {
      return res.status(404).send({
        error: "User Not Found"
      })
    }

    // generate token
    const salt = random()
    user.authentication.sessionToken = authentication(salt, user._id.toString());

    await user.save()
    res.cookie('Draz-Auth', user.authentication.sessionToken, { domain: 'localhost', path: '/' })
    return res.status(200).json(user).end()
  } catch (e) {
    return res.status(500).send({ error: e })
  }
}