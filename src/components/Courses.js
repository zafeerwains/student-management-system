import React from 'react';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { useEffect, useState } from 'react';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { Button, Col, Form, Input, Modal, Row, Space, Tooltip, message } from 'antd';
const initialState = { courseName: "", courseCode: "", description: "" }

export default function Courses() {
    const [state, setState] = useState(initialState);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenForUpdate, setIsModalOpenForUpdate] = useState(false);
    const [coursesData, setcoursesData] = useState([]);

    const deletecourse = async (course) => {
        let deletedcourse = { ...course, status: "deleted" }
        try {
            await setDoc(doc(firestore, "courses", deletedcourse.courseId), deletedcourse);
            let coursesDataAfterDelete = coursesData.filter((course) => course.courseId !== deletedcourse.courseId)
            setcoursesData(coursesDataAfterDelete)
            message.success("The course Deleted successfully")
        } catch (e) {
            console.error("Error Deleting course: ", e);
        }
    }
    const handleChange = (e) => {
        setState((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
    };

    const addcourseToFirestore = async (courseData) => {
        try {
            await setDoc(doc(firestore, 'courses', courseData.courseId), courseData);
            setcoursesData([courseData, ...coursesData]);
            message.success('The course Added successfully');
            setIsModalOpen(false)
        } catch (error) {
            console.error('Error adding document: ', error);
        }
        setState({})
    };

    const handleUpdatecourse = async () => {
        const updatedcoursesData = coursesData.map((course) => {
            if (course.courseId === state.courseId) {
                return { ...course, ...state };
            }
            return course;
        });
        try {
            await setDoc(doc(firestore, 'courses', state.courseId), state);
            setcoursesData(updatedcoursesData);
            message.success('The course Updated successfully');
            setIsModalOpenForUpdate(false);
            setState(initialState)
        }
        catch (error) {
            console.error('Error updating document: ', error);
        }
    };

    const handleAddcourse = () => {
        const courseId = Math.random().toString(36).slice(2);

        const courseData = {
            ...state,
            createdAt: new Date().toLocaleString(),
            courseId,
            status: 'active',
        };

        if (!courseData.courseName || !courseData.description || !courseData.courseCode) {
            message.error('FILL ALL INPUTS');
            return;
        }

        addcourseToFirestore(courseData);
    };


    useEffect(() => {
        const getcoursesFromFirestore = async () => {
            const q = query(collection(firestore, 'courses'), where('status', '==', 'active'));
            const querySnapshot = await getDocs(q);
            const array = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                array.push(data);
            });
            setcoursesData(array);
        };

        getcoursesFromFirestore();
    }, []);
    return (
        <>
            <h1 className='text-center mt-5'>All courses Table</h1>
            <div className="d-flex justify-content-center  my-3">
                <Button
                    onClick={() => setIsModalOpen(true)}
                >
                    Add course
                </Button></div>
            <div className="container ">
                <div className="row">
                    <div className="col">
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">Sr.</th>
                                        <th scope="col">Course code</th>
                                        <th scope="col">Course Name</th>
                                        <th scope="col">Description </th>
                                        <th scope="col">Actions </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {coursesData.map((rowData, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{rowData.courseCode}</td>
                                            <td>{rowData.courseName}</td>
                                            <td>{rowData.description}</td>
                                            <td><Space><Tooltip title="Delete" color='red'  ><Button onClick={() => deletecourse(rowData)} danger icon={<DeleteOutlined />} /></Tooltip>
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
                title="ADD course"
                centered
                open={isModalOpen}
                onOk={handleAddcourse}
                okText="Confirm"
                okButtonProps={{ type: 'primary', color: "primary", className: ' text-center rounded    ' }}
                cancelText="Close"
                onCancel={() => setIsModalOpen(false)}
                style={{ maxWidth: 1000 }}
            >
                <Form layout="vertical" className='py-4'>
                    <Row gutter={16}>
                        <Col xs={24} lg={12}>
                            <Form.Item label="Course Name">
                                <Input placeholder='Input your Course Name' name='courseName' onChange={handleChange} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Form.Item label="Course Code">
                                <Input placeholder='Enter the Course Code' name='courseCode' onChange={handleChange} />
                            </Form.Item>
                        </Col>
                       
                        <Col span={24}>
                            <Form.Item label="Description" className='mb-0'>
                                <Input.TextArea placeholder='Input your Description' name='description' onChange={handleChange} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <div className="d-flex my-2 justify-content-center">
                        <Button onClick={handleAddcourse} className=''>Add course</Button></div>
                </Form>
            </Modal>
            <Modal
                title="Update course"
                centered
                open={isModalOpenForUpdate}
                onOk={handleUpdatecourse}
                okText="Confirm"
                okButtonProps={{ type: 'primary', color: "primary", className: ' text-center rounded' }}
                cancelText="Close"
                onCancel={() => setIsModalOpenForUpdate(false)}
                style={{ maxWidth: 1000 }}
            >
                <Form layout="vertical" className='py-4'>
                    <Row gutter={16}>
                        <Col xs={24} lg={12}>
                            <Form.Item label="Course Name">
                                <Input placeholder='Input your Course Name' name='courseName' value={state.courseName} onChange={handleChange} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Form.Item label="Course Code">
                                <Input placeholder='Enter the Course Code' name='courseCode' value={state.courseCode} onChange={handleChange} />
                            </Form.Item>
                        </Col>
                       
                        <Col span={24}>
                            <Form.Item label="Description" className='mb-0'>
                                <Input.TextArea placeholder='Input your Description' value={state.description} name='description' onChange={handleChange} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <div className="d-flex my-2 justify-content-center">
                        <Button onClick={handleUpdatecourse} className='mx-auto mt-5 text-center'>Update course</Button></div>
                </Form>
            </Modal>
        </>
    )
}