import React from 'react';

export default function PageTitleCustom(props) {
    const { title, breadcrumbList, breadcrumbActive } = props;
    return (
        <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                <div className="page-header">
                    <h2 className="pageheader-title">{title}</h2>
                    {/* template đang cho .pageheader-text display: none */}
                    <p className="pageheader-text">Nulla euismod urna eros, sit amet scelerisque torton lectus vel mauris facilisis faucibus at enim quis massa lobortis rutrum.</p>
                    {
                        breadcrumbActive && breadcrumbList && 
                        <div className="page-breadcrumb">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    {
                                        breadcrumbList?.map((item, index) => 
                                            <li key={index} className="breadcrumb-item">
                                                <a href={item.link} className="breadcrumb-link">{item.title}</a>
                                            </li>
                                        ) 
                                    }
                                    <li className="breadcrumb-item active" aria-current="page">{breadcrumbActive.title}</li>
                                </ol>
                            </nav>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}