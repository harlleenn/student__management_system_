import React, { useState } from "react";
import axios from "axios";
import FormData from "../formData/FormData";
import styles from "./addStudent.module.css";
import { UserRoundPlus } from "lucide-react";
import { toast } from "react-toastify";

export default function AddStudent({
  fetchData,
  mode,
  setMode,
  selectedStudent,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newStudent = { name, course, email };
    try {
      const response = await axios.post(
        "http://localhost:8000/students",
        newStudent,
      );
      const data = await response.data;
      // setCourse("");
      // setName("");
      // setEmail("");
      setMode(null);
      fetchData();
    } catch (error) {
      const data = error.response.data;
      if (data.errors) {
        data.errors.forEach((err) => {
          toast.error(err.msg);
        });
      }
      console.log(error);
      console.log(error.response.data.errors[0].msg);
    }
  };

  return (
    <div>
      <div className={styles.addBtnCont}>
        <button
          className={styles.addBtn}
          onClick={() => setMode((prev) => (prev === "add" ? null : "add"))}
        >
          Add Student <UserRoundPlus width={20} />
        </button>
      </div>

      {mode !== null && (
        <FormData
          email={email}
          setEmail={setEmail}
          course={course}
          setCourse={setCourse}
          name={name}
          setName={setName}
          handleSubmit={handleSubmit}
          mode={mode}
          fetchData={fetchData}
          selectedStudent={selectedStudent}
          setMode={setMode}
        />
      )}
    </div>
  );
}
