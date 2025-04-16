import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';

import Dashboard from './pages/Dashboard';
import DashboardAdmin from './pages/admin/Dashboard';
import Articles from './pages/Articles';
import DetailArticles from './pages/DetailArticles'; 
import Maps from './pages/Maps';
import Report from './pages/Report';
import Account from './pages/Account';
import AboutUs from './pages/Aboutus';
import ContactUs from './pages/Contactus';
import Login from './pages/Login';
import Register from './pages/Register';
import sideBarAdmin from './components/SideBarAdmin';
import Notification from './pages/admin/Notification';
import ArticlesAdmin from './pages/admin/Articles';
import DetailArticlesAdmin from './pages/admin/DetailArticles';
import EditArticleAdmin from './pages/admin/EditArticles';
import Reports from './pages/admin/Reports';
import DetailReport from './pages/admin/DetailReport';
import CreateReport from './pages/admin/CreateReport';
import Settings from './pages/admin/Settings';
import Password from './pages/admin/Password';
import AccountAdmin from './pages/admin/Account';
import CreateArticle from './pages/admin/CreateArticle';


const App = () => {
  const nonSideBarPage = ["/login","/register","/admin/reports/","/admin/articles/"];
  const isAdminPage = window.location.pathname.startsWith('/admin');
  const checkCross = nonSideBarPage.filter(value => window.location.pathname.includes(value)).length > 0;
  let sideBarPage = React.createElement('p', {className : "hidden", key : "hiiiidee"});
  if(!checkCross && !isAdminPage){
    sideBarPage = React.createElement(Sidebar, { key: 'sidebar' });
  }else if(isAdminPage && !checkCross){
    sideBarPage = React.createElement(sideBarAdmin, {key : "side-bar-admin"});
  }
  return React.createElement(
    'div',
    { className: 'flex min-h-screen bg-gray-100' },
    [
      sideBarPage,
      React.createElement(
        'div',
        { className: 'flex-1 p-6', key: 'main-content' },
        React.createElement(
          Routes,
          {},
          [
            React.createElement(Route, { path: '/', element: React.createElement(Dashboard), key: 'route-dashboard' }),
            React.createElement(Route, { path: '/register', element: React.createElement(Register), key: 'route-register' , }),
            React.createElement(Route, { path: '/login', element: React.createElement(Login), key: 'route-login' , }),
            React.createElement(Route, { path: '/articles', element: React.createElement(Articles), key: 'route-articles' }),
            React.createElement(Route, { path: '/articles/:id', element: React.createElement(DetailArticles), key: 'route-detail-article' }), // ✅ Tambahkan route detail
            React.createElement(Route, { path: '/maps', element: React.createElement(Maps), key: 'route-maps' }),
            React.createElement(Route, { path: '/report', element: React.createElement(Report), key: 'route-report' }),
            React.createElement(Route, { path: '/account', element: React.createElement(Account), key: 'route-account' }),
            React.createElement(Route, { path: '/about', element: React.createElement(AboutUs), key: 'route-aboutus' }),
            React.createElement(Route, { path: '/contact', element: React.createElement(ContactUs), key: 'route-contactus' }),
            React.createElement(Route, { path: '/admin/dashboard', element: React.createElement(DashboardAdmin), key: 'route-dashboardAdmin' }),
            React.createElement(Route, { path: '/admin/notification', element: React.createElement(Notification), key: 'route-notification-admin' }),
            React.createElement(Route, { path: '/admin/maps', element: React.createElement(Maps), key: 'route-maps-admin' }),
            React.createElement(Route, { path: '/admin/articles', element: React.createElement(ArticlesAdmin), key: 'route-articles-admin' }),
            React.createElement(Route, { path: '/admin/articles/:id', element: React.createElement(DetailArticlesAdmin), key: 'route-detail-admin' }),
            React.createElement(Route, { path: '/admin/articles/create', element: React.createElement(CreateArticle), key: 'route-create-articles-admin' }),
            React.createElement(Route, { path: '/admin/reports', element: React.createElement(Reports), key: 'route-report-admin' }),
            React.createElement(Route, { path: '/admin/reports/:id', element: React.createElement(DetailReport), key: 'route-detailReport-admin' }),
            React.createElement(Route, { path: '/admin/reports/create', element: React.createElement(CreateReport), key: 'route-create-report-admin' }),
            React.createElement(Route, { path: '/admin/settings', element: React.createElement(Settings), key: 'route-settings-admin' }),
            React.createElement(Route, { path: '/admin/settings/password', element: React.createElement(Password), key: 'route-password-admin' }),
            React.createElement(Route, { path: '/admin/settings/account', element: React.createElement(AccountAdmin), key: 'route-account-admin' }),
          ]
        )
      )
    ]
  );
};

export default App;
