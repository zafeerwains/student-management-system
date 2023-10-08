import { Button, Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { PiStudentFill, PiBooksBold } from 'react-icons/pi'
import { AiFillProfile } from 'react-icons/ai'
import { MenuFoldOutlined, MenuUnfoldOutlined, DashboardFilled, LogoutOutlined, } from '@ant-design/icons';
import React, { useState } from 'react'
import { Navigator ,useNavigate} from 'react-router-dom';

export default function SideBar() {
  const navigate=useNavigate()
  const [collapsed, setCollapsed] = useState(false);
  const linkto = (path) => {
    navigate(path)
  }
  return (<>
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={220}
      style={{
        overflow: 'auto',
        height: '100vh',
        borderTopRightRadius: "15px",
        borderBottomRightRadius: "15px",
        backgroundColor: "#F4F4F4",
      }}
    >
      <div className="demo-logo-vertical" />
      <div className="d-flex">
        {collapsed ? "" : <h4 className='fw-bold pt-3 px-3 mt-1'>Menu</h4>}
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined style={{ color: "black" }} /> : <MenuFoldOutlined style={{ color: "black" }} />}
          onClick={() => setCollapsed(!collapsed)}
          className='px-0 w-100 mx-0 text-light'
          style={{ height: 70, color: "black" }}
        />
      </div>
      <Menu
        style={{ background: "transparent" }}
        mode="vertical"
      >
        <Menu.Item key="1" icon={<DashboardFilled style={{ fontSize: "20px" }} />}  onClick={() => linkto("/")} >
          Dashboard
        </Menu.Item>
        <Menu.Item key="2" icon={<PiStudentFill style={{ fontSize: "20px" }} />} onClick={() => linkto("/students")}>
          Students
        </Menu.Item>

        <Menu.Item key="3" icon={<PiBooksBold style={{ fontSize: "20px" }}/> } onClick={() => linkto("/courses")}>
          Courses
        </Menu.Item>
        <Menu.Item key="4" icon={<AiFillProfile style={{ fontSize: "20px" }} /> } onClick={() => linkto("/attendence")}>
          Attendance
        </Menu.Item>

        <Menu.Item key="14" icon={<LogoutOutlined />}>
          Log Out
        </Menu.Item>
      </Menu>
    </Sider>

  </>
  )
}
