import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import SideBar from './SideBar'
import { Layout } from 'antd'
import Students from './Students';
import Courses from './Courses';
import Attendance from './Attendance';
import Dashboard from "../dashboard/Dashboard"

export default function Index() {
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
                                    background: 'white',
                                }}
                            >
                                <Routes>
                                    <Route path='/students' element={<Students/>}/>
                                    <Route path='/courses' element={<Courses/>}/>
                                    <Route path='/attendence' element={<Attendance/>}/>
                                    <Route path='/' element={<Dashboard/>}/>
                                </Routes>
                            </Layout>
                        </Layout>
                    </div >
                </div >
            </div >
        </>
    )
}