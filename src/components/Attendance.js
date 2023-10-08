import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { firestore } from '../config/firebase';
import { message } from 'antd';

export default function Attendance() {
  const [students, setStudents] = useState([]);
// const [attendanceOfStudent,setAttendancOfStudent]=useState({})
  const markAttendance = (studentId) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.studentId === studentId ? { ...student, present: !student.present } : student
      )
    );
  };
  const attendanceSave = async () => {
    let studentsPresent = students.filter(student => student.present === true);
    let studentsAbsent = students.filter(student => student.present === false);
    const attendanceId = Math.random().toString(36).slice(2);
  
    let attendanceOfStudent = {
      id: attendanceId,
      createdAt: new Date().toLocaleString(),
      PresentStudents: studentsPresent,
      AbsentStudents: studentsAbsent,
    };

    try {
      await setDoc(doc(firestore, 'attendance', attendanceId), attendanceOfStudent);
      message.success('Attendance added successfully');
    } catch (error) {
      console.error('Error adding document: ', error);
      message.error('Error in adding attendance');
    }
  };
  

  useEffect(() => {
    const getStudentsFromFirestore = async () => {
      const q = query(collection(firestore, 'students'), where('status', '==', 'active'));
      const querySnapshot = await getDocs(q);
      const array = [];
      querySnapshot.forEach((doc) => {
        const data = { ...doc.data(), present: false }; // Added return statement
        array.push(data);
      });
      console.log(array);
      setStudents(array);
    };

    getStudentsFromFirestore();
  }, []);

  return (
    <div>
      <h2 className='text-center my-5'>Student Attendance</h2>

      <div className="container ">
        <div className="row">
          <div className="col">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">Sr.</th>
                    <th scope="col">Student Name</th>
                    <th scope="col">Student ID</th>
                    <th scope="col">Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{student.fullName}</td>
                      <td>{student.studentId}</td>
                      <td className='px-4'>
                        <input
                          type="checkbox"
                          checked={student.present}
                          onChange={() => markAttendance(student.studentId)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        </div>
      </div >
      <div className='d-flex justify-content-center'>
        <button className='btn text-center btn-primary'
          onClick={attendanceSave}
        >
          Submit Attendance
        </button>
      </div>
    </div>
  );
}
