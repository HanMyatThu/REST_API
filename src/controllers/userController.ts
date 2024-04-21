import express from 'express'
import { UserModel } from "../models/User";

export const getAllUsers = async (req: express.Request, res: express.Response) => {
  try { 
    const users = await UserModel.find()
    return res.status(200).send({
      users
    })
  } catch (e) {
    return res.status(500).send({
      error: e
    })
  }
}

export const deleteUserById = async (req: express.Request, res: express.Response) => {
  try { 
    const { id } = req.params;

    const deleteduser = await UserModel.deleteOne({_id: id})
    return res.status(200).send({
      deleteduser
    })
  } catch (e) {
    return res.status(500).send({
      error: e
    })
  }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params
    const { username } = req.body

    if (!username) {
      return res.status(400).send({
        error: 'Bad Request'
      })
    }
    const user = await UserModel.findById(id)
    user.username = username
    await user.save()

    return res.status(200).send({
      user
    })
  } catch(e) {
    return res.status(500).send({
      error: e
    })
  }
}