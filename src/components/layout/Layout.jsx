import BottomNavigation from './BottomNavigation'
import SidebarNavigation from './SidebarNavigation'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen bg-surface">

      <SidebarNavigation />

      <main
        className="
          flex-1
          pb-48
          lg:pb-32
          px-6
          pt-10
          lg:px-10
          lg:mr-64
          w-full
        "
      >
        <Outlet />
      </main>

      <BottomNavigation />

    </div>
  )
}