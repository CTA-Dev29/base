import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
//user
const user = React.lazy(() => import('./views/users/users'))
const userForm = React.lazy(() => import('./views/users/userForm'))
//matkul
const matkul = React.lazy(() => import('./views/matkul/matkul'))
const matkulForm = React.lazy(() => import('./views/matkul/matkulForm'))
//tugas
const tugas = React.lazy(() => import('./views/tugas/tugas'))
const tugasForm = React.lazy(() => import('./views/tugas/tugasForm'))
//jawab
const jawab = React.lazy(() => import('./views/jawab/jawab'))
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  //user
  { path: '/users', name: 'Data Users', element: user },
  { path: '/user/add', name: 'Add Users', element: userForm },
  { path: '/user/edit/:id', name: 'Edit Users', element: userForm },
  //matkul
  { path: '/matkul', name: 'Data Matakuliah', element: matkul },
  { path: '/matkul/add', name: 'Add Matakuliah', element: matkulForm },
  { path: '/matkul/edit/:id', name: 'Edit Matakuliah', element: matkulForm },
   //tugas
  { path: '/tugas', name: 'Data Matakuliah', element: tugas },
  { path: '/tugas/add', name: 'Add Matakuliah', element: tugasForm },
  { path: '/tugas/edit/:id', name: 'Edit Matakuliah', element: tugasForm },
  //jawab
  { path: '/tugas/jawab/:id', name: 'jawaban tugas', element: jawab },
]

export default routes
