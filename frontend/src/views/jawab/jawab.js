import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
  CButton,
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheckAlt, cilX, cilChevronLeft, cilPlus, cilPencil, cilTrash } from '@coreui/icons'
import SweetAlert from 'sweetalert2'
import axios from '../../utils/axiosInstance'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

const TugasJawabanPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const loggedUserId = localStorage.getItem('id')
  const loggedNama = localStorage.getItem('nama') || ''
  const loggedNim = localStorage.getItem('nim') || ''

  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  const [tugas, setTugas] = useState(null)
  const [jawabanList, setJawabanList] = useState([])
  const [loading, setLoading] = useState(true)
  const [fileUrls, setFileUrls] = useState({})

  // Modal state
  const [modalVisible, setModalVisible] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentJawaban, setCurrentJawaban] = useState({
    id: null,
    nama: '',
    nim: '',
    file: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tugasRes = await axios.get(`/tugas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const jawabanRes = await axios.get(`/jawab/tugas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (tugasRes.data.status === 'ok') {
          setTugas(tugasRes.data.data)
        }
        if (jawabanRes.data.status === 'ok') {
          setJawabanList(jawabanRes.data.data)

          const newFileUrls = {}
          jawabanRes.data.data.forEach((item) => {
            if (item.file) {
              const blob = new Blob([new Uint8Array(item.file.data)], {
                type: 'application/pdf',
              })
              newFileUrls[item.id] = URL.createObjectURL(blob)
            }
          })
          setFileUrls(newFileUrls)
        }
      } catch (error) {
        SweetAlert.fire('Error', 'Gagal memuat data', 'error')
        navigate('/tugas')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, token, navigate])

  useEffect(() => {
    return () => {
      Object.values(fileUrls).forEach((url) => URL.revokeObjectURL(url))
    }
  }, [fileUrls])

  // Verifikasi nilai
  const handleVerifikasi = async (jawabanId, nilai) => {
    try {
      const res = await axios.put(
        `/jawab/${jawabanId}`,
        { nilai },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      if (res.data.status === 'ok') {
        SweetAlert.fire('Success', 'Jawaban dinilai', 'success')
        setJawabanList((prev) =>
          prev.map((j) => (j.id === jawabanId ? { ...j, nilai } : j)),
        )
      }
    } catch (err) {
      SweetAlert.fire('Error', 'Gagal memberi nilai', 'error')
    }
  }

  // Hapus jawaban
  const handleHapus = (jawabanId) => {
    SweetAlert.fire({
      title: 'Yakin hapus jawaban ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus',
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(`/jawab/${jawabanId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (res.data.status === 'ok') {
            SweetAlert.fire('Deleted!', 'Jawaban berhasil dihapus.', 'success')
            setJawabanList((prev) => prev.filter((j) => j.id !== jawabanId))
            setFileUrls((prev) => {
              const newUrls = { ...prev }
              if (newUrls[jawabanId]) {
                URL.revokeObjectURL(newUrls[jawabanId])
                delete newUrls[jawabanId]
              }
              return newUrls
            })
          }
        } catch (error) {
          SweetAlert.fire('Error', 'Gagal menghapus jawaban', 'error')
        }
      }
    })
  }

  // Buka modal tambah jawaban
  const openAddModal = () => {
    setEditMode(false)
    setCurrentJawaban({
      id: null,
      nama: loggedNama,
      nim: loggedNim,
      file: null,
    })
    setModalVisible(true)
  }

  // Buka modal edit jawaban, hanya jika user yang sama
  const openEditModal = (jawaban) => {
    if (jawaban.id_user != loggedUserId) {
      SweetAlert.fire('Error', 'Anda hanya dapat mengedit jawaban sendiri', 'error')
      return
    }
    setEditMode(true)
    setCurrentJawaban({
      id: jawaban.id,
      nama: jawaban.User?.nama || loggedNama,
      nim: jawaban.User?.nim || loggedNim,
      file: null,
    })
    setModalVisible(true)
  }

  // Handle perubahan file saja (nama & nim readonly)
  const handleFileChange = (e) => {
    setCurrentJawaban((prev) => ({
      ...prev,
      file: e.target.files[0],
    }))
  }

  // Submit tambah/edit jawaban
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!currentJawaban.nama || !currentJawaban.nim) {
      SweetAlert.fire('Error', 'Nama dan NIM wajib diisi', 'error')
      return
    }

    try {
      const formData = new FormData()
      formData.append('id_user',loggedUserId)
      formData.append('id_tugas', id)
      if (currentJawaban.file) {
        formData.append('file', currentJawaban.file)
      }

      let res
      if (editMode) {
        res = await axios.put(`/jawab/${currentJawaban.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        })
      } else {
        res = await axios.post(`/jawab/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        })
      }

      if (res.data.status === 'ok') {
        SweetAlert.fire('Success', `Jawaban berhasil ${editMode ? 'diubah' : 'ditambahkan'}`, 'success')
        setModalVisible(false)
        setLoading(true)

        // Refresh data jawaban dan file URL
        const jawabanRes = await axios.get(`/jawab/tugas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (jawabanRes.data.status === 'ok') {
          setJawabanList(jawabanRes.data.data)

          const newFileUrls = {}
          jawabanRes.data.data.forEach((item) => {
            if (item.file) {
              const blob = new Blob([new Uint8Array(item.file.data)], {
                type: 'application/pdf',
              })
              newFileUrls[item.id] = URL.createObjectURL(blob)
            }
          })
          setFileUrls(newFileUrls)
        }
        setLoading(false)
      }
    } catch (error) {
      SweetAlert.fire('Error', `Gagal ${editMode ? 'mengubah' : 'menambah'} jawaban`, 'error')
    }
  }

  if (loading) {
    return (
      <div className="text-center mt-5">
        <CSpinner />
      </div>
    )
  }

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h5>Jawaban Tugas: {tugas?.judul}</h5>
        <div>
          <CButton color="primary" className="me-2" onClick={openAddModal}>
            <CIcon icon={cilPlus} className="me-2" /> Tambah Jawaban
          </CButton>
          <CButton color="secondary" variant="outline" onClick={() => navigate(-1)}>
            <CIcon icon={cilChevronLeft} className="me-2" /> Back
          </CButton>
        </div>
      </div>

      {jawabanList.map((item) => (
        <CCard className="mb-4" key={item.id}>
          <CCardHeader>Data Mahasiswa</CCardHeader>
          <CCardBody>
            <CTable small bordered>
              <CTableBody>
                <CTableRow>
                  <CTableHeaderCell>Nama</CTableHeaderCell>
                  <CTableDataCell>{item.User?.nama || '-'}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>NIM</CTableHeaderCell>
                  <CTableDataCell>{item.User?.nim || '-'}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Waktu Upload</CTableHeaderCell>
                  <CTableDataCell>{new Date(item.createdAt).toLocaleString()}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell>Nilai</CTableHeaderCell>
                  <CTableDataCell>{item.nilai ?? '-'}</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>

          <CCardHeader>File PDF Jawaban</CCardHeader>
          <CCardBody>
            {fileUrls[item.id] ? (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer fileUrl={fileUrls[item.id]} plugins={[defaultLayoutPluginInstance]} />
              </Worker>
            ) : (
              <p>Tidak ada file PDF</p>
            )}
          </CCardBody>

          <CCardBody className="d-flex gap-2 justify-content-end">
            <CButton
              color="success"
              variant="outline"
              onClick={() =>
                SweetAlert.fire({
                  title: 'Masukkan Nilai',
                  input: 'number',
                  inputAttributes: {
                    min: 0,
                    max: 100,
                  },
                  inputLabel: 'Nilai (0-100)',
                  showCancelButton: true,
                }).then((result) => {
                  if (result.isConfirmed && result.value !== '') {
                    handleVerifikasi(item.id, result.value)
                  }
                })
              }
            >
              <CIcon icon={cilCheckAlt} className="me-2" />
              Verifikasi
            </CButton>

            {/* Tombol Edit hanya muncul jika user yang login sama dengan owner jawaban */}
            {item.id_user == loggedUserId && (
              <CButton color="warning" variant="outline" onClick={() => openEditModal(item)}>
                <CIcon icon={cilPencil} className="me-2" />
                Edit
              </CButton>
            )}

            {/* Tombol Hapus juga bisa dibatasi kalau mau, contoh dibatasi sama user yang sama */}
            {item.id_user == loggedUserId && (
              <CButton color="danger" variant="outline" onClick={() => handleHapus(item.id)}>
                <CIcon icon={cilTrash} className="me-2" />
                Hapus
              </CButton>
            )}
          </CCardBody>
        </CCard>
      ))}

      {/* Modal tambah/edit jawaban */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader closeButton>
          <CModalTitle>{editMode ? 'Edit Jawaban' : 'Tambah Jawaban'}</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmit}>
          <CModalBody>
            <div className="mb-3">
              <CFormLabel>Nama</CFormLabel>
              <CFormInput name="nama" value={currentJawaban.nama} readOnly />
            </div>
            <div className="mb-3">
              <CFormLabel>NIM</CFormLabel>
              <CFormInput name="nim" value={currentJawaban.nim} readOnly />
            </div>
            <div className="mb-3">
              <CFormLabel>File PDF (upload baru untuk mengganti)</CFormLabel>
              <CFormInput type="file" accept="application/pdf" onChange={handleFileChange} />
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setModalVisible(false)}>
              Batal
            </CButton>
            <CButton color="primary" type="submit">
              Simpan
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </div>
  )
}

export default TugasJawabanPage
