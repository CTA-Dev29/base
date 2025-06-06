import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilUser,
  cilPuzzle,
  cilSpeedometer,
  cilBook,
  cilDescription
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

// Ambil role dari localStorage
const role = localStorage.getItem('role') || 'user' // default user

const navAdmin = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Tugas',
    to: '/tugas',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Mata Kuliah',
    to: '/matkul',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Users',
    to: '/users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
]

const navUser = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Mata Kuliah',
    to: '/matkul',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
]

const _nav = role === 'admin' ? navAdmin : navUser

export default _nav
