import React, { useState } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Coffee, 
  LayoutDashboard, 
  ShoppingCart, 
  DollarSign, 
  BarChart3, 
  Users, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  Bell
} from 'lucide-react';
import clsx from 'clsx';

const DashboardLayout: React.FC = () => {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Vendas', href: '/sales', icon: ShoppingCart },
    { name: 'Caixa', href: '/cash-register', icon: DollarSign },
    { name: 'Relatórios', href: '/reports', icon: BarChart3 },
    { name: 'Funcionários', href: '/employees', icon: Users },
    { name: 'Configurações', href: '/settings', icon: Settings },
  ];

  const NavItem = ({ item }: { item: typeof navigation[0] }) => {
    const isActive = location.pathname === item.href;
    
    return (
      <Link
        to={item.href}
        className={clsx(
          isActive
            ? 'bg-blue-800 text-white'
            : 'text-blue-100 hover:bg-blue-700',
          'group flex items-center px-2 py-2 text-base font-medium rounded-md'
        )}
      >
        <item.icon
          className={clsx(
            isActive ? 'text-white' : 'text-blue-300 group-hover:text-white',
            'mr-4 flex-shrink-0 h-6 w-6'
          )}
          aria-hidden="true"
        />
        {item.name}
      </Link>
    );
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div
        className={clsx(
          'fixed inset-0 flex z-40 md:hidden',
          sidebarOpen ? 'block' : 'hidden'
        )}
      >
        <div
          className={clsx(
            'fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity',
            sidebarOpen ? 'opacity-100 ease-out duration-300' : 'opacity-0 ease-in duration-200'
          )}
          onClick={() => setSidebarOpen(false)}
        ></div>

        <div
          className={clsx(
            'relative flex-1 flex flex-col max-w-xs w-full bg-blue-900 transition ease-in-out duration-300 transform',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <Coffee className="h-8 w-8 text-white" />
              <span className="ml-2 text-white text-xl font-bold">Caixa Lanchonete</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-blue-800 p-4">
            <div className="flex items-center">
              <div>
                <div className="bg-blue-700 rounded-full h-9 w-9 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs font-medium text-blue-200 group-hover:text-blue-100">
                  {user?.role === 'admin' ? 'Administrador' : user?.role === 'manager' ? 'Gerente' : 'Caixa'}
                </p>
              </div>
              <button
                onClick={logout}
                className="ml-auto bg-blue-800 flex-shrink-0 p-1 rounded-full text-blue-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white"
              >
                <span className="sr-only">Sair</span>
                <LogOut className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-blue-900">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Coffee className="h-8 w-8 text-white" />
                <span className="ml-2 text-white text-xl font-bold">Caixa Lanchonete</span>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-blue-800 p-4">
              <div className="flex items-center">
                <div>
                  <div className="bg-blue-700 rounded-full h-9 w-9 flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs font-medium text-blue-200 group-hover:text-blue-100">
                    {user?.role === 'admin' ? 'Administrador' : user?.role === 'manager' ? 'Gerente' : 'Caixa'}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="ml-auto bg-blue-800 flex-shrink-0 p-1 rounded-full text-blue-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white"
                >
                  <span className="sr-only">Sair</span>
                  <LogOut className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="border-b border-gray-200 pb-4 flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
                </h1>
                <div className="flex items-center">
                  <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <span className="sr-only">View notifications</span>
                    <Bell className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="py-4">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;