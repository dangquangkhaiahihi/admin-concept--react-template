import React from 'react';
import { Link } from 'react-router-dom';
import './access-denied.scss';

export default function AccessDenied() {
    return (
        <div className="access-denied text-center">
            <div className="error mx-auto">403</div>
            <p className="lead text-gray-800 mb-5">Access Denied</p>
            <p className="text-gray-500 mb-0">Bạn không có quyền truy cập vào trang này!</p>
            <Link to="/">&larr; Trở về trang chủ</Link>
        </div>
    )
}