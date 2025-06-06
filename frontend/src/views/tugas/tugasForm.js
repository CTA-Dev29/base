import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CButton,
  CSpinner,
} from '@coreui/react'
import axios from '../../utils/axiosInstance'
import SweetAlert from 'sweetalert2'

const TugasFormPage = () => {
  const { id } = useParams() // null jika add, ada jika edit
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [loadingData, setLoadingData] = useState(Boolean(id))
  const [loadingSubmit, setLoadingSubmit] = useState(false)

  const [matkulOptions, setMatkulOptions] = useState([])
  const [form, setForm] = useState({
    judul: '',
    id_matkul: '',
  })

  // Fetch matkul options untuk dropdown
  useEffect(() => {
    const fetchMatkul = async () => {
      try {
        const res = await axios.get('/matkul', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setMatkulOptions(res.data.data || [])
      } catch (error) {
        SweetAlert.fire('Error', 'Gagal memuat data mata kuliah', 'error')
      }
    }
    fetchMatkul()
  }, [token])

  // Kalau edit, fetch data tugas by id
  useEffect(() => {
    if (!id) return
    const fetchTugas = async () => {
      try {
        const res = await axios.get(`/tugas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.data.status === 'ok') {
          const data = res.data.data
          setForm({
            judul: data.judul || '',
            id_matkul: data.id_matkul || '',
          })
        } else {
          SweetAlert.fire('Error', 'Data tugas tidak ditemukan', 'error')
          navigate('/tugas')
        }
      } catch (error) {
        SweetAlert.fire('Error', 'Gagal mengambil data tugas', 'error')
        navigate('/tugas')
      } finally {
        setLoadingData(false)
      }
    }
    fetchTugas()
  }, [id, token, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.judul.trim() || !form.id_matkul) {
      SweetAlert.fire('Warning', 'Judul dan Mata Kuliah harus diisi', 'warning')
      return
    }
    setLoadingSubmit(true)
    try {
      let res
      if (id) {
        // Edit mode
        res = await axios.put(`/tugas/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        // Add mode
        res = await axios.post('/tugas', form, {
          headers: { Authorization: `Bearer ${token}` },
        })
      }
      if (res.data.status === 'ok') {
        SweetAlert.fire('Success', `Tugas berhasil ${id ? 'diperbarui' : 'ditambahkan'}`, 'success')
        navigate('/tugas')
      } else {
        SweetAlert.fire('Error', res.data.message || 'Gagal menyimpan data', 'error')
      }
    } catch (error) {
      SweetAlert.fire('Error', error.response?.data?.message || 'Terjadi kesalahan', 'error')
    } finally {
      setLoadingSubmit(false)
    }
  }

  if (loadingData) {
    return (
      <div className="text-center mt-5">
        <CSpinner />
      </div>
    )
  }

  return (
    <CCard className="mb-4">
      <CCardHeader>{id ? 'Edit Tugas' : 'Tambah Tugas Baru'}</CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          <div className="mb-3">
            <CFormLabel htmlFor="judul">Judul Tugas</CFormLabel>
            <CFormInput
              type="text"
              id="judul"
              name="judul"
              value={form.judul}
              onChange={handleChange}
              placeholder="Masukkan judul tugas"
              disabled={loadingSubmit}
              required
            />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="id_matkul">Mata Kuliah</CFormLabel>
            <CFormSelect
              id="id_matkul"
              name="id_matkul"
              value={form.id_matkul}
              onChange={handleChange}
              disabled={loadingSubmit}
              required
            >
              <option value="">-- Pilih Mata Kuliah --</option>
              {matkulOptions.map((matkul) => (
                <option key={matkul.id} value={matkul.id}>
                  {matkul.nama}
                </option>
              ))}
            </CFormSelect>
          </div>
          <CButton type="submit" color="primary" disabled={loadingSubmit}>
            {loadingSubmit ? (id ? 'Menyimpan...' : 'Menambahkan...') : id ? 'Update' : 'Tambah'}
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default TugasFormPage
