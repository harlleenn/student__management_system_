import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import AddStudent from "../addStudent/AddStudent";
import styles from "./studentDisplay.module.css";
import { Edit, Sidebar, Trash } from "lucide-react";
import Logout from "../profile/Profile";
import FileUpload from "../fileUpload/FileUpload";
import { toast, ToastContainer } from "react-toastify";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
  accessToken,
} from "../../auth";
import SearchInput from "../searchInput/SearchInput";
import LoadingSpinner from "./LoadingSpinner";
import LeftSidebar from "../Sidebar/LeftSidebar";
import { AuthContext } from "../../context/AuthContext";
// when in search go back why no students
export default function StudentData() {
  const [students, setStudents] = useState([]);
  const [mode, setMode] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setlimit] = useState(4);
  const scrollContainerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [lengthMessage, setLengthMessage] = useState("")
const loadingRef = useRef(false);
const hasMoreDataRef = useRef(true)
const {user, setUser} = useContext(AuthContext)
useEffect(() => {
  loadingRef.current = loading;
  hasMoreDataRef.current = hasMoreData;
}, [loading, hasMoreData]);

  const fetchData = async (appendMore) => {
    try {
      setLoading(true);
      console.log("here loading is true as i am getting the data", loading);
      const response = await axios.get(
        `http://localhost:8000/students?search=${query}&page=${currentPage}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        },
      );

      if (response.data.length < limit) {
        setHasMoreData(false);
      } else {
        setHasMoreData(true);
      }
      if(response.data.length === 0){
        setLengthMessage("No such student found ")
      }else{
        setLengthMessage("")
      }

      if (appendMore) {
        setStudents((prev) => [...prev, ...response.data]);
      } else {
        setStudents(response.data);
      }
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 403) {
        try {
          const response = await axios.post(
            `http://localhost:8000/refresh`,
            {},
            {
              withCredentials: true,
            },
          );
          const newAccessToken = response.data.accessToken;

          setAccessToken(newAccessToken);

          const retryResponse = await axios.get(
            "http://localhost:8000/students",
            {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            },
          );

          setStudents(retryResponse.data);
        } catch (error) {
          console.log("refresh token has expired");
          console.log(error);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(false);
    setLoading(true);
  }, []);

  useEffect(() => {
    if (currentPage > 1) {
      fetchData(true);
    }
  }, [currentPage]);


  const handleThrottle = (fn, delay) => {
    let lastCallTime = 0;
    return function throttled() {
      const now = Date.now();
      if (now - lastCallTime >= delay) {
        lastCallTime = now;
        fn();
      } else {
        console.log("throttling is happnening it will wait untl the now-last>delay");
      }
    };
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, clientHeight, scrollHeight } = container;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;

    if (isNearBottom && !loadingRef.current && hasMoreDataRef.current) {
      console.log("near bottom, this is where we'll trigger the next fetch");
      setMessage("i will be shown when the page has been incremented");

      setCurrentPage((prev) => prev + 1);
      setLoading(true);
    }
  };

  const throttleScroll = useRef(handleThrottle(handleScroll, 200));


  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", throttleScroll.current);
    return () => {
      container.removeEventListener("scroll", throttleScroll.current);
    };
  }, [loading, hasMoreData]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        setCurrentPage(1);
        setHasMoreData(true);
        fetchData(false);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);
  

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8000/students/${id}`, {}).then(() => {
      fetchData(false);
      toast.warn("Student has been deleted", {
        position: "top-right",
        closeButton: false,
        autoClose: 2000,
        progress: false,
      });
    });
  };

  return (
    <div>
      <ToastContainer />

      <header>
        <Logout />
      </header>
      <div className={styles.sidebar}>
         <LeftSidebar/>
      </div>

      <AddStudent
        fetchData={fetchData}
        mode={mode}
        setMode={setMode}
        selectedStudent={selectedStudent}
      />
      <SearchInput query={query} setQuery={setQuery} />
   <div className={styles.lengthMessageCont}>
    <div className={styles.lengthMessage}>
        {lengthMessage}
    </div>
  
   </div>
      {loading ? <LoadingSpinner /> : ""}
      {user === "Admin" ? "hello this is the admin no need to send as in login" :"idkkk"}
      <table className={styles.tableDisplay} ref={scrollContainerRef}>
        <tbody className={styles.tableBody}>
          <tr>
            <th>Student id</th>
            <th>Student image</th>
            <th>Name</th>
            <th>Email</th>
            <th>Course</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>
                <img
                  src={`http://localhost:8000/students/${student.id}/images`}
                  width="80"
                  alt="student"
                />
                <FileUpload studentId={student.id} />
              </td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.course}</td>
              <td>{student.created_at}</td>
              <td>
                <div className={styles.actionCont}>
                  <button
                    className={styles.editBtn}
                    onClick={() => {
                      setMode((prev) => (prev === "edit" ? null : "edit"));
                      setSelectedStudent(student);
                    }}
                  >
                    Edit <Edit width={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    className={styles.deleteBtn}
                  >
                    Delete <Trash width={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
         
         
        </tbody>
      </table>
       

      <div className={styles.pageCont}>
        <div className={styles.pageInfo}>
          Page {currentPage} out of 5 pages
        </div>
         
         </div> 
      {/* hardcoded numberof pages for now */}
    
    
    
      {!hasMoreData && <div>No more students to load</div>}
    </div>
  );
}