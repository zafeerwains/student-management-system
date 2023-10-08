import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import SideBar from './SideBar'
import { Layout } from 'antd'
import Students from './Students';

export default function Index() {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <>
            <div className="container-xxl">
                <div className="row">
                    <div className="col p-0">
                        <Layout style={{
                            background: 'transparent'
                        }} >

                            <SideBar />
                            <Layout
                                className="site-layout"
                                style={{
                                    marginLeft: collapsed ? 80 : 220,
                                    background: 'white',
                                }}
                            >
                                <Routes>
                                    <Route path='/students' element={<Students/>}/>
                                </Routes>
                            </Layout>
                        </Layout>
                    </div >
                </div >
            </div >
        </>
    )
}