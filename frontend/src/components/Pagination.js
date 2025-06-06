import React from 'react'
import { CPagination, CPaginationItem, CRow, CCol } from '@coreui/react'

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  indexOfFirstItem,
  indexOfLastItem,
  totalEntries,
}) => {
  return (
    <CRow>
      <CCol>
        <div>
          Showing {indexOfFirstItem + 1} to {indexOfLastItem} of {totalEntries} entries
        </div>
      </CCol>
      <CCol xs="auto">
        <CPagination aria-label="Page navigation example">
          <CPaginationItem
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </CPaginationItem>
          {currentPage > 2 && (
            <>
              <CPaginationItem onClick={() => onPageChange(1)}>1</CPaginationItem>
              {currentPage > 3 && <CPaginationItem disabled>...</CPaginationItem>}
            </>
          )}
          {currentPage > 1 && (
            <CPaginationItem onClick={() => onPageChange(currentPage - 1)}>
              {currentPage - 1}
            </CPaginationItem>
          )}
          <CPaginationItem active>{currentPage}</CPaginationItem>
          {currentPage < totalPages && (
            <CPaginationItem onClick={() => onPageChange(currentPage + 1)}>
              {currentPage + 1}
            </CPaginationItem>
          )}
          {currentPage < totalPages - 1 && (
            <>
              {currentPage < totalPages - 2 && <CPaginationItem disabled>...</CPaginationItem>}
              <CPaginationItem onClick={() => onPageChange(totalPages)}>
                {totalPages}
              </CPaginationItem>
            </>
          )}
          <CPaginationItem
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </CPaginationItem>
        </CPagination>
      </CCol>
    </CRow>
  )
}

export default Pagination
