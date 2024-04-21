import express from 'express'
import _ from 'lodash'
import { UserModel } from '../models/User'

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { id } = req.params
    const currentUser = _.get(req, 'identity._id') as string

    if (!currentUser) {
      return res.status(403).send({
        error: 'Forbidden'
      })
    }

    if (currentUser.toString() !== id) {
      return res.status(403).send({
        error: 'Forbidden'
      })
    }

    next()
  } catch(e) {
    return res.status(400).send({ error: e})
  }
}

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const sessionToken = req.cookies['Draz-Auth']

    if (!sessionToken) {
      return res.status(403).send({
        error: 'Forbidden'
      })
    }

    const user = await UserModel.findOne({'authentication.sessionToken': sessionToken})
    if (!user) {
      return res.status(403).send({
        error: 'Unauthorized Error'
      })
    }
    _.merge(req, { identity: user })

    return next()
  } catch(e) {
    return res.status(400).send({ error: e})
  }
}