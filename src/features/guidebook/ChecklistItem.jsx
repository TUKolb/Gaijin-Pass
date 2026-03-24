import { useState } from 'react'

export default function ChecklistItem({ text, storageKey }) {
  const [checked, setChecked] = useState(() => {
    return localStorage.getItem(storageKey) === 'true'
  })

  function toggle() {
    const next = !checked
    setChecked(next)
    localStorage.setItem(storageKey, String(next))
  }

  return (
    <li
      className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50 ${checked ? 'opacity-60' : ''}`}
      onClick={toggle}
    >
      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
        checked ? 'bg-green-500 border-green-500' : 'border-gray-400'
      }`}>
        {checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>}
      </div>
      <span className={checked ? 'line-through text-gray-500' : 'text-gray-700'}>{text}</span>
    </li>
  )
}
