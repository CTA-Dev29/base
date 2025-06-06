import React, { useState, useEffect } from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CFormInput,CCardFooter,CPagination,CPaginationItem
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilPlus, cilPen } from '@coreui/icons'
import axios from '../../utils/axiosInstance'
import SweetAlert from 'sweetalert2'
import { Link } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import bufferToBase64 from '../../utils/blobToBase64'

const user = () => {
  const [data, setData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  const token = localStorage.getItem('token');
  // Function to fetch data from the API
  const fetchData = async () => {
    setLoading(true)
    
    try {
    const response = await axios.get(`/auth/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
        setData(response.data.data.reverse())
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000) // Auto-refresh every 5 seconds
    return () => clearInterval(interval) // Cleanup interval on unmount
  }, [])

  

  // Handle search term filter
  const filteredData = data.filter(
    (item) =>
      item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.divisis?.nama.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem) // Sliced data for current page
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Handle delete and edit actions
  const handleDelete = (id) => {
    SweetAlert.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/auth/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    })
          .then((res) => {
            if (res.data.status === 'ok') {
              SweetAlert.fire('Deleted!', res.data.message, 'success')
              fetchData()
            } else {
              SweetAlert.fire('Error', res.data.message, 'error')
            }
          })
          .catch(() => {
            SweetAlert.fire('Error', 'Failed to delete user', 'error')
          })
      }
    })
  }

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <h5>Data Users</h5>
      </CCardHeader>
      <CCardBody>
        {/* Export buttons */}
        <CRow className="mb-3">
          <CCol>
            <Link to="/user/add" className="btn btn-primary">
              <CIcon icon={cilPlus} className="me-2" />
              Add User
            </Link>
          </CCol>
          <CCol xs="auto">
            <CFormInput
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CCol>
        </CRow>

        {/* Table structure */}
        <CTable hover striped bordered responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>No.</CTableHeaderCell>
              <CTableHeaderCell>Gambar</CTableHeaderCell>
              <CTableHeaderCell>Nama</CTableHeaderCell>
              <CTableHeaderCell>No WhatsApp</CTableHeaderCell>
              <CTableHeaderCell>Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentData.map((item, index) => (
              <CTableRow key={index}>
                      <CTableDataCell>
        {indexOfFirstItem + index + 1} {/* Nomor dihitung mundur */}
      </CTableDataCell>
             <CTableDataCell>
                  {item.avatar && item.avatar.data ? (
                    <img
                      src={bufferToBase64(item.avatar.data)}
                      alt={item.username}
                      width="40"
                      height="40"
                      style={{ objectFit: 'cover', borderRadius: '50%' }}
                    />
                  ) : (
                    'No Image'
                  )}
                </CTableDataCell>
                <CTableDataCell>{item.username}</CTableDataCell>
                <CTableDataCell>{item.nowa}</CTableDataCell>
              
                <CTableDataCell>
                  {/* Edit and Delete buttons */}
                  <Link to={`/user/edit/${item.id}`}>
                    <CButton color="info" size="sm">
                      <CIcon icon={cilPen} />
                    </CButton>
                  </Link>
                  <CButton
                    color="danger"
                    size="sm"
                    className="ms-2"
                    onClick={() => handleDelete(item.id)}
                  >
                    <CIcon icon={cilTrash} /> {/* Delete Icon */}
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        {/* Pagination Footer */}
        <CCardFooter>
      <CRow>
           <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={Math.min(indexOfLastItem, filteredData.length)}
            totalEntries={filteredData.length}
            onPageChange={setCurrentPage}
          />
          </CRow>
        </CCardFooter>
      </CCardBody>
    </CCard>
  )
}

export default user
