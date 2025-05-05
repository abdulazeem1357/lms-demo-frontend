import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  RiHomeFill, 
  RiHomeLine,
  RiBookFill,
  RiBookLine,
  RiUserFill,
  RiUserLine,
} from 'react-icons/ri';

type NavItem = {
  path: string;
  label: string;
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
};

const MobileNavFooter: React.FC = () => {
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      path: '/courses',
      label: 'Courses',
      activeIcon: <RiBookFill className="text-xl" />,
      inactiveIcon: <RiBookLine className="text-xl" />
    },
    // {
    //   path: '/search',
    //   label: 'Search',
    //   activeIcon: <RiSearchFill className="text-xl" />,
    //   inactiveIcon: <RiSearchLine className="text-xl" />
    // },
    {
      path: '/dashboard',
      label: 'Dashboard',
      activeIcon: <RiHomeFill className="text-xl" />,
      inactiveIcon: <RiHomeLine className="text-xl" />
    },
    // {
    //   path: '/notifications',
    //   label: 'Alerts',
    //   activeIcon: <RiBellFill className="text-xl" />,
    //   inactiveIcon: <RiBellLine className="text-xl" />
    // },
    {
      path: '/profile',
      label: 'Profile',
      activeIcon: <RiUserFill className="text-xl" />,
      inactiveIcon: <RiUserLine className="text-xl" />
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-lg h-16 px-2 z-50">
      <div className="h-full flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path 
                           || (item.path === '/dashboard' && location.pathname === '/');
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex flex-col items-center justify-center w-16 h-full transition-colors duration-200
                ${isActive ? 'text-primary-500' : 'text-neutral-500 hover:text-primary-400'}`
              }
            >
              <div className={`
                ${item.path === '/dashboard' ? 'bg-primary-500 text-white p-3 rounded-full mb-1' : ''}
              `}>
                {isActive ? item.activeIcon : item.inactiveIcon}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavFooter;