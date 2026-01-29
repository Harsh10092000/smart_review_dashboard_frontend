const TablePagination = ({ currentPage, totalPages, onPageChange }) => {
  const maxVisiblePages = 5;
  const halfVisible = Math.floor(maxVisiblePages / 2);
  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div
      className="pagination-modern"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px 0',
        gap: '10px',
        flexWrap: 'wrap',
      }}
    >
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        style={{
          padding: '8px 16px',
          border: 'none',
          borderRadius: '999px',
          //background: currentPage === 1 ? '#e0e0e0' : '#f8f9fa',
          color: currentPage === 1 ? '#bdbdbd' : '#1976d2',
          fontWeight: 600,
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s, color 0.2s',
        }}
      >
        &#171; First
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: '8px 16px',
          border: 'none',
          borderRadius: '999px',
          // background: currentPage === 1 ? '#e0e0e0' : '#f8f9fa',
          color: currentPage === 1 ? '#bdbdbd' : '#1976d2',
          fontWeight: 600,
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s, color 0.2s',
        }}
      >
        &#8592; Prev
      </button>
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            padding: '8px 14px',
            border: 'none',
            borderRadius: '50%',
            background: currentPage === page ? '#1976d2' : '#fff',
            color: currentPage === page ? '#fff' : '#1976d2',
            fontWeight: currentPage === page ? 700 : 600,
            boxShadow: currentPage === page ? '0 2px 8px rgba(25, 118, 210, 0.10)' : '0 1px 4px rgba(0,0,0,0.04)',
            cursor: 'pointer',
            outline: currentPage === page ? '2px solid #1976d2' : 'none',
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: '8px 16px',
          border: 'none',
          borderRadius: '999px',
          //background: currentPage === totalPages ? '#e0e0e0' : '#f8f9fa',
          color: currentPage === totalPages ? '#bdbdbd' : '#1976d2',
          fontWeight: 600,
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s, color 0.2s',
        }}
      >
        Next &#8594;
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        style={{
          padding: '8px 16px',
          border: 'none',
          borderRadius: '999px',
          //background: currentPage === totalPages ? '#e0e0e0' : '#f8f9fa',
          color: currentPage === totalPages ? '#bdbdbd' : '#1976d2',
          fontWeight: 600,
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s, color 0.2s',
        }}
      >
        Last &#187;
      </button>
    </div>
  );
};

export default TablePagination;