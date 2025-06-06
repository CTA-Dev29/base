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
import { cilPen, cilTrash, cilPlus,cilFolderOpen } from '@coreui/icons'
import axios from '../../utils/axiosInstance'
import SweetAlert from 'sweetalert2'
import { Link } from 'react-router-dom'
import Pagination from '../../components/Pagination'

const Tugas = () => {
  const [data, setData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const token = localStorage.getItem('token')

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`/tugas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      // data diasumsikan ada di response.data.data
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

  // Filter berdasarkan judul dan nama matkul (relasi)
  const filteredData = data.filter(
    (item) =>
      item.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.matkul?.nama?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Handle delete tugas
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
          .delete(`/tugas/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            if (res.data.status === 'ok') {
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
        <h5>Data Tugas</h5>
      </CCardHeader>
      <CCardBody>
        <CRow className="mb-3">
          <CCol>
            <Link to="/tugas/add" className="btn btn-primary">
              <CIcon icon={cilPlus} className="me-2" />
              Add Tugas
            </Link>
          </CCol>
          <CCol xs="auto">
            <CFormInput
              type="text"
              placeholder="Search by Judul or Mata Kuliah"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CCol>
        </CRow>

        <CTable hover striped bordered responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>No.</CTableHeaderCell>
              <CTableHeaderCell>Judul Tugas</CTableHeaderCell>
              <CTableHeaderCell>Mata Kuliah</CTableHeaderCell>
              <CTableHeaderCell>Created At</CTableHeaderCell>
              <CTableHeaderCell>Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentData.map((item, index) => (
              <CTableRow key={item.id}>
                <CTableDataCell>{indexOfFirstItem + index + 1}</CTableDataCell>
                <CTableDataCell>{item.judul}</CTableDataCell>
                <CTableDataCell>{item.matkul?.nama || '-'}</CTableDataCell>
                <CTableDataCell>{new Date(item.createdAt).toLocaleString()}</CTableDataCell>
              <CTableDataCell>
                <div className="d-flex flex-wrap gap-2">
                     <Link to={`/tugas/jawab/${item.id}`}>
                    <CButton   color="success" size="sm">
                         <CIcon icon={cilFolderOpen} />
                        Jawab
                    </CButton>
                    </Link>
                    <Link to={`/tugas/edit/${item.id}`}>
                    <CButton color="info" size="sm">
                        <CIcon icon={cilPen} /> Edit
                    </CButton>
                    </Link>

                    <CButton
                    color="danger"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    >
                    <CIcon icon={cilTrash} /> Hapus
                    </CButton>

                   
                </div>
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

export default Tugas
