import { NavLink } from 'react-router-dom'

const navItems = [
  {
    path: '/',
    label: 'Home',
    icon: '🏠',
  },
  {
    path: '/search',
    label: 'Search',
    icon: '🔍',
  },
  {
    path: '/library',
    label: 'Library',
    icon: '📚',
  },
  {
    path: '/upload',
    label: 'Upload',
    icon: '⬆️',
  },
]

export default function MobileNav() {
  return (
    <nav className="grid h-20 grid-cols-4 gap-1 border-t border-gray-800 bg-[#181818] px-2 py-2">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            isActive
              ? 'flex flex-col items-center justify-center rounded-md bg-green-600 text-xs text-black'
              : 'flex flex-col items-center justify-center rounded-md text-xs text-gray-400'
          }
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}