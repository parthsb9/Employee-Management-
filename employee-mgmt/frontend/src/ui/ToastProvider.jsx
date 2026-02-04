import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastCtx = createContext({ addToast: () => {} })

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', timeout = 3000) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter(t => t.id !== id))
    }, timeout)
  }, [])

  const value = useMemo(() => ({ addToast }), [addToast])

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1080 }}>
        {toasts.map(t => (
          <div key={t.id} className={`toast show align-items-center text-bg-${colorMap(t.type)} border-0 mb-2`} role="alert">
            <div className="d-flex">
              <div className="toast-body">{t.message}</div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}></button>
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

function colorMap(type) {
  if (type === 'success') return 'success'
  if (type === 'error') return 'danger'
  if (type === 'warning') return 'warning'
  return 'secondary'
}

export function useToast() {
  return useContext(ToastCtx)
}