import React, { useState, useEffect } from "react";
import styles from "./formData.module.css";
import axios from "axios";
import { toast } from "react-toastify";
export default function FormData({
  name,
  setName,
  email,
  setEmail,
  course,
  setCourse,
  handleSubmit,
  mode,
  fetchData,
  selectedStudent,
  setMode,
}) {
  const [edit, setEdit] = useState({ name: "", email: "", course: "" });
  useEffect(() => {
    if (selectedStudent) {
      setEdit({
        name: selectedStudent.name,
        email: selectedStudent.email,
        course: selectedStudent.course,
      });
    }
  }, [selectedStudent]);

  const handlePost = async (id) => {
    try {
      const reponse = await axios.put(
        `http://localhost:8000/students/${id}`,
        edit,
      );

      fetchData();
      toast.info("student has been edited", {
        position: "top-right",
        closeButton: false,
      });
      setMode(null);
      console.log("Student has been edited");
    } catch (error) {
      const data = error.response.data;
      if (data.errors) {
        data.errors.forEach((err) => toast.error(err.msg));
      }
    }
  };

  return (
    <div className={styles.formCont}>
      {mode === "edit" ? (
        <form className={styles.formInputs}>
          <input
            placeholder="Student Name edited"
            value={edit.name} // the current name that is already being shown
            onChange={(e) => setEdit({ ...edit, name: e.target.value })}
          />

          <input
            placeholder="Student email edited"
            value={edit.email} // the current name that is already being shown
            onChange={(e) => setEdit({ ...edit, email: e.target.value })}
          />
          <input
            placeholder="Student Course edited"
            value={edit.course} // the current name that is already being shown
            onChange={(e) => setEdit({ ...edit, course: e.target.value })}
          />
          <button
            type="button"
            className={styles.editStudent}
            onClick={() => handlePost(selectedStudent.id)}
          >
            Edit student
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className={styles.formInputs}>
          <input
            type="text"
            required
            placeholder="Student name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            required
            placeholder="Student Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            required
            placeholder="Student Course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
          <button type="submit" className={styles.addStudent}>
            Add student
          </button>
        </form>
      )}
    </div>
  );
}
