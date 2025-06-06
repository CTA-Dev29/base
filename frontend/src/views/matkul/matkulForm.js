import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CRow,
  CCol,
} from '@coreui/react'
import axios from '../../utils/axiosInstance'
import { useNavigate, useParams } from 'react-router-dom'
import SweetAlert from 'sweetalert2'

const MatkulForm = () => {
  const [nama, setNama] = useState('')
  const [kode, setKode] = useState('')
  const [sks, setSks] = useState('')
  const [dosen, setDosen] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { id } = useParams()
  const token = localStorage.getItem('token')

  // Jika id ada, berarti mode edit, ambil data matkul dari API
  useEffect(() => {
    if (id) {
      setLoading(true)
      axios
        .get(`/matkul/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const data = res.data.data
          setNama(data.nama || '')
          setKode(data.kode || '')
          setSks(data.sks ? data.sks.toString() : '')
          setDosen(data.dosen || '')
        })
        .catch(() => {
          SweetAlert.fire('Error', 'Gagal mengambil data mata kuliah', 'error')
        })
        .finally(() => setLoading(false))
    }
  }, [id, token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nama || !kode || !sks || !dosen) {
      SweetAlert.fire('Warning', 'Semua field harus diisi', 'warning')
      return
    }

    setLoading(true)

    const payload = { nama, kode, sks: parseInt(sks), dosen }

    try {
      if (id) {
        // Edit
        const res = await axios.put(`/matkul/${id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.data.status === 'success') {
          SweetAlert.fire('Success', 'Data berhasil diupdate', 'success')
          navigate('/matkul')
        } else {
          throw new Error(res.data.message)
        }
      } else {
        // Create
        const res = await axios.post('/matkul', payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.data.status === 'success') {
          SweetAlert.fire('Success', 'Data berhasil ditambahkan', 'success')
          navigate('/matkul')
        } else {
          throw new Error(res.data.message)
        }
      }
    } catch (error) {
      SweetAlert.fire('Error', error.message || 'Terjadi kesalahan', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CCard>
      <CCardHeader>
        <h5>{id ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah'}</h5>
      </CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel>Nama Mata Kuliah</CFormLabel>
              <CFormInput
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                disabled={loading}
                required
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel>Kode</CFormLabel>
              <CFormInput
                type="text"
                value={kode}
                onChange={(e) => setKode(e.target.value)}
                disabled={loading}
                required
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel>SKS</CFormLabel>
              <CFormInput
                type="number"
                min={0}
                value={sks}
                onChange={(e) => setSks(e.target.value)}
                disabled={loading}
                required
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel>Dosen</CFormLabel>
              <CFormInput
                type="text"
                value={dosen}
                onChange={(e) => setDosen(e.target.value)}
                disabled={loading}
                required
              />
            </CCol>
          </CRow>
          <CCardFooter>
            <CButton type="submit" color="primary" disabled={loading}>
              {id ? 'Update' : 'Simpan'}
            </CButton>
            <CButton
              color="secondary"
              className="ms-2"
              onClick={() => navigate('/matkul')}
              disabled={loading}
            >
              Batal
            </CButton>
          </CCardFooter>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default MatkulForm
