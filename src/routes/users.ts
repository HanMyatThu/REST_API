import express from 'express'

import { deleteUserById, getAllUsers, updateUser } from '../controllers/userController'
import { isAuthenticated, isOwner } from '../middleware'

export default (router: express.Router) => {
  router.get('/users', isAuthenticated, getAllUsers)
  router.delete('/users/:id', isOwner, deleteUserById)
  router.patch('/users/:id', isOwner, updateUser)
}