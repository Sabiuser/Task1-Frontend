import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [task, setTask] = useState([]);
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState({
    orderNumber: "",
    name: "",
    city: "",
    phoneNo: "",
    email: "",
  });

  const getFunction = async () => {
    try {
      const response = await axios.get("http://localhost:5000/Orders/get-Order");
      setTask(response?.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (e) => {
    setValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const ValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const ValidPhone = (phone) =>
    /^(\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}$/.test(phone.trim());

  const ValidName = (name) => {
    if (!name) return false;
    return /^[A-Za-z\s\-\(\)]+$/.test(name.trim());
  };

  const handleSubmit = async () => {
    const { orderNumber, name, city, phoneNo, email } = value;

    if (!orderNumber || !name || !city || !phoneNo || !email) {
      alert("Please fill in all fields.");
      return;
    }

    if (!ValidName(name)) {
      alert("Name should be valid.");
      return;
    }

    if (!ValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!ValidPhone(phoneNo)) {
      alert("Phone number must be 10 digits.");
      return;
    }

    const formattedData = {
      orderNumber: orderNumber.trim(),
      customer: {
        name: name.trim(),
        address: { city: city.trim() },
        phone: phoneNo.trim(),
        email: email.trim(),
      },
    };

    try {
      await axios.post("http://localhost:5000/orders/post-order", formattedData);
      alert("Order added successfully!");
      setValue({ orderNumber: "", name: "", city: "", phoneNo: "", email: "" });
      setEdit(false);
      getFunction();
    } catch (err) {
      console.error("Error posting data:", err);
    }
  };

  const handleUpdate = async () => {
    const { orderNumber, name, city, phoneNo, email } = value;

    if (!orderNumber || !name || !city || !phoneNo || !email) {
      alert("Please fill in all fields.");
      return;
    }

    if (!ValidName(name)) {
      alert("Name should be valid.");
      return;
    }

    if (!ValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!ValidPhone(phoneNo)) {
      alert("Phone number must be 10 digits.");
      return;
    }

    const formattedData = {
      orderNumber: orderNumber.trim(),
      customer: {
        name: name.trim(),
        address: { city: city.trim() },
        phone: phoneNo.trim(),
        email: email.trim(),
      },
    };

    try {
      await axios.put("http://localhost:5000/orders/put-order", formattedData);
      alert("Order updated successfully!");
      setValue({ orderNumber: "", name: "", city: "", phoneNo: "", email: "" });
      setEdit(false);
      getFunction();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleDelete = async (orderNumber) => {
    try {
      await axios.delete("http://localhost:5000/orders/delete-order", {
        data: { orderNumber },
      });
      alert("Order deleted successfully!");
      getFunction();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  useEffect(() => {
    getFunction();
  }, []);

  return (
    <div className="flex flex-col items-center p-6 gap-10 min-h-screen bg-gray-100">
      <div className="flex flex-col gap-4 w-full max-w-3xl bg-white p-6 rounded-xl shadow-md">
        <TextField label="ID" name="orderNumber" value={value.orderNumber} onChange={handleChange} variant="outlined" fullWidth disabled={edit} />
        <TextField label="Name" name="name" value={value.name} onChange={handleChange} variant="outlined" fullWidth />
        <TextField label="City" name="city" value={value.city} onChange={handleChange} variant="outlined" fullWidth />
        <TextField label="Phone No" name="phoneNo" value={value.phoneNo} onChange={handleChange} variant="outlined" fullWidth />
        <TextField label="Email" name="email" value={value.email} onChange={handleChange} variant="outlined" fullWidth />

        <div className="flex justify-end gap-4">
          {edit ? (
            <Button variant="contained" color="primary" onClick={handleUpdate}>Update</Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
          )}
        </div>
      </div>

      <div className="w-full max-w-6xl">
        <TableContainer component={Paper} className="shadow-lg">
          <Table>
            <TableHead>
              <TableRow className="bg-pink-200 text-3xl">
                <TableCell>ID</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">City</TableCell>
                <TableCell align="center">Phone No</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Edit</TableCell>
                <TableCell align="center">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {task.map((customer, index) => (
                <TableRow key={index}>
                  <TableCell>{customer?.orderNumber || ""}</TableCell>
                  <TableCell align="center">{customer?.customer?.name || ""}</TableCell>
                  <TableCell align="center">{customer?.customer?.address?.city || ""}</TableCell>
                  <TableCell align="center">{customer?.customer?.phone || ""}</TableCell>
                  <TableCell align="center">{customer?.customer?.email || ""}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        setValue({
                          orderNumber: customer?.orderNumber || "",
                          name: customer?.customer?.name || "",
                          city: customer?.customer?.address?.city || "",
                          phoneNo: customer?.customer?.phone || "",
                          email: customer?.customer?.email || "",
                        });
                        setEdit(true);
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(customer?.orderNumber)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default App;




