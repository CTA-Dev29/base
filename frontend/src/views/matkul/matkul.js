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
  CFormInput,
  CCardFooter,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilPlus, cilPen } from '@coreui/icons'
import axios from '../../utils/axiosInstance'
import SweetAlert from 'sweetalert2'
import { Link } from 'react-router-dom'
import Pagination from '../../components/Pagination'

const Matkul = () => {
  const [data, setData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`/matkul/`, {
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
    const interval = setInterval(fetchData, 5000) // Auto-refresh tiap 5 detik
    return () => clearInterval(interval)
  }, [])

  // Filter data berdasarkan search term (nama, kode, dosen)
  const filteredData = data.filter(
    (item) =>
      item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.dosen?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Handle delete
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
          .delete(`/matkul/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            if (res.data.status === 'success') {
              SweetAlert.fire('Deleted!', res.data.message || 'Data deleted', 'success')
              fetchData()
            } else {
              SweetAlert.fire('Error', res.data.message || 'Failed to delete', 'error')
            }
          })
          .catch(() => {
            SweetAlert.fire('Error', 'Failed to delete data', 'error')
          })
      }
    })
  }

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <h5>Data Mata Kuliah</h5>
      </CCardHeader>
      <CCardBody>
        <CRow className="mb-3">
          <CCol>
            <Link to="/matkul/add" className="btn btn-primary">
              <CIcon icon={cilPlus} className="me-2" />
              Add Mata Kuliah
            </Link>
          </CCol>
          <CCol xs="auto">
            <CFormInput
              type="text"
              placeholder="Search by Nama, Kode, or Dosen"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CCol>
        </CRow>

        <CTable hover striped bordered responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>No.</CTableHeaderCell>
              <CTableHeaderCell>Nama Mata Kuliah</CTableHeaderCell>
              <CTableHeaderCell>Kode</CTableHeaderCell>
              <CTableHeaderCell>SKS</CTableHeaderCell>
              <CTableHeaderCell>Dosen</CTableHeaderCell>
              <CTableHeaderCell>Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentData.map((item, index) => (
              <CTableRow key={item.id}>
                <CTableDataCell>{indexOfFirstItem + index + 1}</CTableDataCell>
                <CTableDataCell>{item.nama}</CTableDataCell>
                <CTableDataCell>{item.kode}</CTableDataCell>
                <CTableDataCell>{item.sks}</CTableDataCell>
                <CTableDataCell>{item.dosen}</CTableDataCell>
                <CTableDataCell>
                  <Link to={`/matkul/edit/${item.id}`}>
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
                    <CIcon icon={cilTrash} />
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

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

export default Matkul
