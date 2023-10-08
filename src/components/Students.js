import React from 'react';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { useEffect, useState } from 'react';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { Button, Col, Form, Input, Modal, Row, Space, Tooltip, message } from 'antd';
const initialState = { fullName: "", fatherName: "", phoneNumber: "", email: '', adress: "" }

export default function Students() {
  const [state, setState] = useState(initialState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenForUpdate, setIsModalOpenForUpdate] = useState(false);
  const [studentsData, setStudentsData] = useState([]);

  const deleteStudent = async (student) => {
    let deletedStudent = { ...student, status: "deleted" }
    try {
      await setDoc(doc(firestore, "students", deletedStudent.studentId), deletedStudent);
      let studentsDataAfterDelete = studentsData.filter((student) => student.studentId !== deletedStudent.studentId)
      setStudentsData(studentsDataAfterDelete)
      message.success("The student Deleted successfully")
    } catch (e) {
      console.error("Error Deleting student: ", e);
    }
  }
  const handleChange = (e) => {
    setState((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const addStudentToFirestore = async (studentData) => {
    try {
      await setDoc(doc(firestore, 'students', studentData.studentId), studentData);
      setStudentsData([studentData, ...studentsData]);
      message.success('The student Added successfully');
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error adding document: ', error);
    }
    setState({})
  };

  const handleUpdateStudent = async () => {
    const updatedStudentsData = studentsData.map((student) => {
      if (student.studentId === state.studentId) {
        return { ...student, ...state };
      }
      return student;
    });
    try {
      await setDoc(doc(firestore, 'students', state.studentId), state);
      setStudentsData(updatedStudentsData);
      message.success('The student Updated successfully');
      setIsModalOpenForUpdate(false);
      setState(initialState)
    }
    catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const handleAddStudent = () => {
    const studentId = Math.random().toString(36).slice(2);

    const studentData = {
      ...state,
      createdAt: new Date().toLocaleString(),
      studentId,
      status: 'active',
    };

    if (!studentData.fullName || !studentData.fatherName || !studentData.adress || !studentData.email || !studentData.phoneNumber) {
      message.error('FILL ALL INPUTS');
      return;
    }

    addStudentToFirestore(studentData);
  };


  useEffect(() => {
    const getStudentsFromFirestore = async () => {
      const q = query(collection(firestore, 'students'), where('status', '==', 'active'));
      const querySnapshot = await getDocs(q);
      const array = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        array.push(data);
      });
      setStudentsData(array);
    };

    getStudentsFromFirestore();
  }, []);
  return (
    <>
      <h1 className='text-center mt-5'>All students Table</h1>
      <div className="d-flex justify-content-center  my-3">
        <Button
          onClick={() => setIsModalOpen(true)}
        >
          Add student
        </Button></div>
      <div className="container ">
        <div className="row">
          <div className="col">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">Sr.</th>
                    <th scope="col">Full Name</th>
                    <th scope="col">Father Name</th>
                    <th scope="col">Phone </th>
                    <th scope="col">Email</th>
                    <th scope="col">Address</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsData.map((rowData, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{rowData.fullName}</td>
                      <td>{rowData.fatherName}</td>
                      <td>{rowData.phoneNumber}</td>
                      <td>{rowData.email}</td>
                      <td>{rowData.adress}</td>
                      <td><Space><Tooltip title="Delete" color='red'  ><Button onClick={() => deleteStudent(rowData)} danger icon={<DeleteOutlined />} /></Tooltip>
                        <Tooltip title="Edit"  ><Button type="primary" icon={<EditOutlined onClick={() => {
                          setIsModalOpenForUpdate(true)
                          setState(rowData)
                        }} />} /></Tooltip></Space></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div >
      <Modal
        title="ADD student"
        centered
        open={isModalOpen}
        onOk={handleAddStudent}
        okText="Confirm"
        okButtonProps={{ type: 'primary', color: "primary", className: ' text-center rounded    ' }}
        cancelText="Close"
        onCancel={() => setIsModalOpen(false)}
        style={{ maxWidth: 1000 }}
      >
        <Form layout="vertical" className='py-4'>
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item label="Full Name">
                <Input placeholder='Input your Full Name' name='fullName' onChange={handleChange} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="Father Name">
                <Input placeholder='Enter the Father Name' name='fatherName' onChange={handleChange} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="Phone Number">
                <Input placeholder='Enter the Phone Number' name='phoneNumber' onChange={handleChange} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="Email">
                <Input placeholder='Enter the Email' name='email' onChange={handleChange} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Adress" className='mb-0'>
                <Input.TextArea placeholder='Input your adress' name='adress' onChange={handleChange} />
              </Form.Item>
            </Col>
          </Row>
          <div className="d-flex my-2 justify-content-center">
            <Button onClick={handleAddStudent} className=''>Add student</Button></div>
        </Form>
      </Modal>
      <Modal
        title="Update Student"
        centered
        open={isModalOpenForUpdate}
        onOk={handleUpdateStudent}
        okText="Confirm"
        okButtonProps={{ type: 'primary', color: "primary", className: ' text-center rounded' }}
        cancelText="Close"
        onCancel={() => setIsModalOpenForUpdate(false)}
        style={{ maxWidth: 1000 }}
      >
        <Form layout="vertical" className='py-4'>
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item label="Full Name">
                <Input placeholder='Input your Full Name' name='fullName' value={state.fullName} onChange={handleChange} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="Father Name">
                <Input placeholder='Enter the Father Name' name='fatherName' value={state.fatherName} onChange={handleChange} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="Phone Number">
                <Input placeholder='Enter the Phone Number' name='phoneNumber' value={state.phoneNumber} onChange={handleChange} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="Email">
                <Input placeholder='Enter the Email ' name='email' value={state.email} onChange={handleChange} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Adress" className='mb-0'>
                <Input.TextArea placeholder='Input your Adress' value={state.adress} name='adress' onChange={handleChange} />
              </Form.Item>
            </Col>
          </Row>
          <div className="d-flex my-2 justify-content-center">
            <Button onClick={handleUpdateStudent} className='mx-auto mt-5 text-center'>Update student</Button></div>
        </Form>
      </Modal>
    </>
  )
}