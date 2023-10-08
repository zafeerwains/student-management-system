import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { firestore } from '../config/firebase';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';


export default function ShowAttendance() {
    const navigate=useNavigate()
    const [attendence, setattendencesData] = useState([])
    console.log(attendence);
    useEffect(() => {
        const getattendencesFromFirestore = async () => {
            const q = query(collection(firestore, 'attendance'));
            const querySnapshot = await getDocs(q);
            const array = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                array.push(data);
            });
            setattendencesData(array);
        };

        getattendencesFromFirestore();
    }, []);
    return (<>
        <h1 className='text-center mt-5'>All attendences Table</h1>
        <div className="d-flex justify-content-center  my-3">
                <Button
                    onClick={()=>navigate("/attendence")}
                >
                    Add attendence
                </Button></div>
        <div className="container ">
            <div className="row">
                <div className="col">
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Sr.</th>
                                    <th scope="col">attendence code</th>
                                    <th scope="col">attendence Date</th>
                                    <th scope="col">Present Students </th>
                                    <th scope="col">Absent Students  </th>

                                    {/* <th scope="col">Actions </th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {attendence.map((rowData, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{rowData.id}</td>
                                        <td>{rowData.createdAt}</td>
                                        <td>
                                            {rowData.PresentStudents.length}{" "}
                                            <span className='text-danger'
                                                onClick={() => {
                                                    const studentNames = rowData.PresentStudents.map((student, index) => (index + 1) + '=' + student.fullName).join(', ');
                                                    alert(studentNames);
                                                }}
                                            >
                                                SEE LIST
                                            </span>
                                        </td>



                                        <td>   {rowData.AbsentStudents.length}{" "}
                                            <span className='text-danger'
                                                onClick={() => {
                                                    const studentNames = rowData.AbsentStudents.map((student, index) => (index + 1) + '=' + student.fullName).join(', ');
                                                    alert(studentNames);
                                                }}
                                            >
                                                SEE LIST
                                            </span></td>
                                        {/* <td><Space><Tooltip title="Delete" color='red'  ><Button onClick={() => deleteattendence(rowData)} danger icon={<DeleteOutlined />} /></Tooltip>
                                                <Tooltip title="Edit"  ><Button type="primary" icon={<EditOutlined onClick={() => {
                                                    setIsModalOpenForUpdate(true)
                                                    setState(rowData)
                                                }} />} /></Tooltip></Space></td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div >
    </>
    )
}
