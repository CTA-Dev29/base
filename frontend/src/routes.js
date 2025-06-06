import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
//user
const user = React.lazy(() => import('./views/users/users'))
const userForm = React.lazy(() => import('./views/users/userForm'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  //user
  { path: '/users', name: 'Data Users', element: user },
  { path: '/user/add', name: 'Add Users', element: userForm },
  { path: '/user/edit/:id', name: 'Edit Users', element: userForm },
]

export default routes
