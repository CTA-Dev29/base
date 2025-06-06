import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormLabel,
  CFormInput,
  CButton,
  CSpinner,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import axios from '../../utils/axiosInstance'
import { useParams, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

const FormUser = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm()

  const [loading, setLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)

  // Convert buffer API ke URL gambar
  const avatarBufferToUrl = (avatar) => {
    if (!avatar?.data) return null
    const uint8Array = new Uint8Array(avatar.data)
    const blob = new Blob([uint8Array], { type: 'image/png' }) // sesuaikan tipe gambar
    return URL.createObjectURL(blob)
  }

  // Load data user saat edit dan set preview avatar + nowa
  useEffect(() => {
    if (isEdit) {
      axios
        .get(`/auth/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const user = res.data.data
          setValue('username', user.username)
          setValue('nowa', user.nowa || '') // set nowa di form
          if (user.avatar) {
            const url = avatarBufferToUrl(user.avatar)
            setAvatarPreview(url)
          }
        })
        .catch((err) => {
          console.error('Gagal load user', err)
        })
    }
  }, [id, isEdit, setValue, token])

  // Watch avatar untuk preview
  const watchAvatar = watch('avatar')
  useEffect(() => {
    if (watchAvatar && watchAvatar.length > 0) {
      const file = watchAvatar[0]
      const url = URL.createObjectURL(file)
      setAvatarPreview(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [watchAvatar])

  // Submit form
  const onSubmit = async (data) => {
    setLoading(true)

    const formData = new FormData()
    formData.append('username', data.username)
    formData.append('nowa', data.nowa) // kirim nowa ke backend
    formData.append('email', data.email)
    formData.append('role', data.role)

    if (!isEdit || (isEdit && data.password)) {
      formData.append('password', data.password)
    }
    if (data.avatar && data.avatar.length > 0) {
      formData.append('avatar', data.avatar[0])
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }

      const res = isEdit
        ? await axios.put(`/auth/${id}`, formData, config)
        : await axios.post(`/auth/register`, formData, config)

      if (res.data.status === 'success' || res.data.status === 'ok') {
        Swal.fire({
          icon: 'success',
          title: isEdit ? 'Update berhasil!' : 'Registrasi berhasil!',
          showConfirmButton: false,
          timer: 1500,
        })
        navigate('/users')
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: res.data.message || 'Terjadi kesalahan',
        })
      }
    } catch (err) {
      console.error(err)
      Swal.fire({
        icon: 'error',
        title: 'Gagal menyimpan data',
        text: err.response?.data?.message || err.message || 'Coba lagi nanti',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <CCard>
      <CCardHeader>{isEdit ? 'Edit User' : 'Add User'}</CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="mb-3">
            <CFormLabel>Username</CFormLabel>
            <CFormInput {...register('username', { required: true })} />
            {errors.username && <div className="text-danger">Username wajib diisi</div>}
          </div>

          {/* Nomor WhatsApp */}
          <div className="mb-3">
            <CFormLabel>Nomor WhatsApp</CFormLabel>
            <CFormInput
              type="text"
              placeholder="Contoh: 6281234567890"
              {...register('nowa', {
                required: true,
                pattern: {
                  value: /^[0-9]+$/,
                  message: 'Nomor WA hanya boleh berisi angka',
                },
                minLength: {
                  value: 8,
                  message: 'Nomor WA minimal 8 digit',
                },
                maxLength: {
                  value: 15,
                  message: 'Nomor WA maksimal 15 digit',
                },
              })}
            />
            {errors.nowa && (
              <div className="text-danger">{errors.nowa.message || 'Nomor WA wajib diisi'}</div>
            )}
          </div>

          <div className="mb-3">
            <CFormLabel>Password {isEdit ? '(Kosongkan jika tidak ingin diganti)' : ''}</CFormLabel>
            <CFormInput
              type="password"
              {...register('password', {
                required: !isEdit,
                minLength: isEdit ? 0 : 6,
              })}
            />
            {errors.password && !isEdit && (
              <div className="text-danger">Password wajib diisi minimal 6 karakter</div>
            )}
          </div>

          <div className="mb-3">
            <CFormLabel>Avatar (gambar)</CFormLabel>
            <CFormInput type="file" accept="image/*" {...register('avatar')} />
          </div>

          {avatarPreview && (
            <div className="mb-3">
              <strong>Preview Avatar:</strong>
              <br />
              <img
                src={avatarPreview}
                alt="avatar preview"
                style={{ width: '120px', borderRadius: '8px', marginTop: '8px' }}
              />
            </div>
          )}

          <CButton type="submit" color="primary" disabled={loading}>
            {loading ? <CSpinner size="sm" /> : isEdit ? 'Update' : 'Submit'}
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default FormUser
