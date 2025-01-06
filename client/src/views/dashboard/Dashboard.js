import React, { useEffect, useState } from 'react'
import { Button, Input, Select, Table, Row, Col, Space, Modal, Alert, DatePicker, Card } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { LineChartOutlined } from "@ant-design/icons";
import user from "../../assets/images/avatars/5.jpg"
import moment from "moment";
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CFormInput,
  CFormSelect,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import {
  UsergroupAddOutlined
} from '@ant-design/icons';
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'
import axiosInstance from '../../../AxiosConfig'
import "./dashboard.css";

const { Option } = Select;
const { confirm } = Modal;

const Dashboard = () => {

  const [cardsDatas, setCardsData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [employees, setEmployees] = useState([])
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    status: '',
    profilePicture: '',
    dateOfJoining: '',
    probationEndDate: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [isModalVisible1, setIsModalVisible1] = useState(false);


  // Open modal for editing
  const openEditModal = (employee) => {
    setFormData({
      name: employee.name,
      department: employee.department,
      status: employee.status,
      profilePicture: employee.profilePicture,
    });
    setEditingEmployeeId(employee._id);
    setEditMode(true);
    setIsModalVisible1(true);
  };

  // Close modal
  const handleCancel = () => {
    setIsModalVisible1(false);
    setIsModalVisible(false);
    setFormData({ name: '', department: '', status: '', profilePicture: '' });
    setEditMode(false);
    setEditingEmployeeId(null);
  };

  // Open the modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Handle profile picture upload
  const handleFileUpload = async (event) => {
    setLoading(true)
    const file = event.target.files[0];
    const uploadData = new FormData();
    uploadData.append('profilePicture', file);

    try {
      const response = await axiosInstance.post('/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.success) {
        const { url } = response.data;
        setFormData((prev) => ({
          ...prev,
          profilePicture: url, // Save the uploaded URL
        }));
        setPreviewImage(url); // Set preview image
        setLoading(false)
      } else {
        console.error('Upload failed:', response.data.error);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle DatePicker changes
  const handleDateChange = (date, dateString) => {
    setFormData((prev) => ({
      ...prev,
      dateOfJoining: dateString,
      probationEndDate: dateString
    }));
  };

  // Handle DatePicker changes
  const handleDateChange1 = (date, dateString) => {
    setFormData((prev) => ({
      ...prev,
      probationEndDate: dateString
    }));
  };

  // Handle select changes
  const handleSelectChange = (value, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const cardsData = [
    {
      title: "Users",
      value: "26K",
      change: "-12.4%",
      trend: "down",
      color: "#845EC2",
    },
    {
      title: "Income",
      value: "$6,200",
      change: "40.9%",
      trend: "up",
      color: "#2D9CDB",
    },
    {
      title: "Conversion Rate",
      value: "2.49%",
      change: "84.7%",
      trend: "up",
      color: "#F2C94C",
    },
    {
      title: "Sessions",
      value: "44K",
      change: "-23.6%",
      trend: "down",
      color: "#EB5757",
    },
  ];

  const AddEployee = async () => {
    try {
      const res = await axiosInstance.post('add', {
        "name": formData.name,
        "department": formData.department,
        "status": formData.status,
        "profilePicture": formData.profilePicture,
        "dateOfJoining": formData.dateOfJoining,
        "probationEndDate": formData.probationEndDate

      })
      if (res) {
        setIsModalVisible(false);
        fetchEmployees();
      }
    } catch (err) {
      console.error('Error fetching employees:', err.message)
    }
  }

  const handleSubmit = () => {
    // console.log(formData);
    AddEployee();
  };

  const handleSave = async () => {
    try {
      await axiosInstance.put("edit", {
        id: editingEmployeeId,
        name: formData.name,
        department: formData.department,
        status: formData.status,
        profilePicture: formData.profilePicture,
      });
      fetchEmployees(); // Refresh the employee list after saving
      handleCancel(); // Close the modal
      <Alert message="Employee Updated" type="success" showIcon />
    } catch (err) {
      console.error('Error updating employee:', err.message);
    }
  };


  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Profile Picture',
      dataIndex: 'profilePicture',
      key: 'profilePicture',
      render: (text, record) => (!record.profilePicture == "" ?
        <img
          src={record.profilePicture || user}
          alt={record.name}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            objectFit: 'scale-down',
            border: '1px solid #ddd',
          }}
        /> :
        <img
          src={user}
          alt={record.name}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            objectFit: 'scale-down',
            border: '1px solid #ddd',
          }}
        />
      ),
    },
    { title: 'Date Of Joining', dataIndex: 'dateOfJoining', key: 'dateOfJoining', render: (_, record) => (record.dateOfJoining ? record.dateOfJoining : "NA") },

    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button onClick={() => DeletEmp(record._id)} danger>
            Delete
          </Button>
          <Button type="primary" onClick={() => openEditModal(record)} style={{ marginLeft: 10 }}>
            Update
          </Button>
        </span>
      ),
    },
  ];

  const fetchEmployees = async () => {
    try {
      const res = await axiosInstance.get('employees', {
        "page": 1,
        "limit": 10,
        "search": "",
        "department": formData.department,
        "status": formData.status
      })
      console.log(res);

      setEmployees(res?.data?.employees)
      setTotalCount(res?.data?.totalCount)
      setCardsData(res?.data)
    } catch (err) {
      console.error('Error fetching employees:', err.message)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [page, status, department])

  // Filter employees based on search input (client-side)
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(search.toLowerCase())
  );

  // const handleDelete = async (id) => {
  //   try {
  //     await axiosInstance.delete("delete", {
  //       id: id
  //     });
  //     fetchEmployees(); // Refresh the employee list after saving
  //     handleCancel(); // Close the modal
  //     <Alert message="Employee Delated" type="success" showIcon />
  //   } catch (err) {
  //     console.error('Error Deleting employee:', err.message);
  //   }
  // }

  const totalPages = Math.ceil(totalCount / 10)

  const DeletEmp = async (id) => {
    console.log(id);
    confirm({
      title: 'Do you want to delete these Employee?',
      icon: <ExclamationCircleFilled />,
      // content: 'Some descriptions',
      onOk() {
        console.log("pkl");
        axiosInstance.delete("delete", {
          id: id
        });
        fetchEmployees(); // Refresh the employee list after saving
        handleCancel(); // Close the modal
        <Alert message="Employee Delated" type="success" showIcon />
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  return (
    <>
      {/* <WidgetsDropdown className="mb-4" /> */}
      <>
        <Row gutter={16} className="mb-4">
          {cardsData.map((card, index) => (
            <Col span={6} key={index}>
              <Card
                style={{
                  backgroundColor: card.color,
                  color: "white",
                  borderRadius: "8px",
                }}
                bodyStyle={{ padding: "16px" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <h2 style={{ margin: 0 }}>{card.value}</h2>
                    <p style={{ margin: 0 }}>{card.title}</p>
                    <p style={{ margin: 0 }}>
                      {card.change}{" "}
                      <span style={{ color: card.trend === "up" ? "green" : "red" }}>
                        {card.trend === "up" ? "↑" : "↓"}
                      </span>
                    </p>
                  </div>
                  <LineChartOutlined style={{ fontSize: "24px", opacity: 0.8 }} />
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <CCard className="mb-4">
          <div>
            {/* <h1>Employee Dashboard</h1> */}

            <Space style={{ marginTop: 10, marginLeft: "10px" }} >
              <Input
                placeholder="Search by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ marginBottom: 10 }}
              />

              <Select
                value={department}
                onChange={(value) => setDepartment(value)}
                placeholder="Select Department"
                style={{ width: 200, marginBottom: 10, marginRight: 10 }}
              >
                <Option value="">All Departments</Option>
                <Option value="HR">HR</Option>
                <Option value="Engineering">Engineering</Option>
              </Select>

              <Select
                value={status}
                onChange={(value) => setStatus(value)}
                placeholder="Select Status"
                style={{ width: 200, marginBottom: 10 }}
              >
                <Option value="">All Status</Option>
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>

              <Button
                // disabled={page === 1}
                onClick={showModal}
                style={{ width: 200, marginBottom: 10 }}
              >
                <UsergroupAddOutlined /> ADD EMPLOYEE
              </Button>

            </Space>

            <Table
              columns={columns}
              dataSource={filteredEmployees}
              rowKey="_id"
              pagination={false}
              style={{ marginBottom: 20 }}
            />

            <Row justify="space-between" align="middle">
              <Col>
                <Button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  type="default"
                >
                  Previous
                </Button>
              </Col>
              <Col>
                <span>
                  Page {page} of {totalPages || 1}
                </span>
              </Col>
              <Col style={{ textAlign: 'right' }}>
                <Button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  type="default"
                >
                  Next
                </Button>
              </Col>
            </Row>


            <Modal
              title="Employee Details"
              visible={isModalVisible}
              onCancel={handleCancel}
              footer={[
                <Button key="back" onClick={handleCancel}>
                  Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit} disabled={loading}>
                  Submit
                </Button>,
              ]}
              className="modal-container"
            >
              {/* Name */}
              <div style={{ marginBottom: '16px' }}>
                <label>Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter name"
                />
              </div>

              {/* Department Select */}
              <div style={{ marginBottom: '16px' }}>
                <label>Department</label>
                <Select
                  placeholder="Select Department"
                  // value={formData.department}
                  onChange={(value) => handleSelectChange(value, 'department')}
                  style={{ width: '100%' }}
                >
                  <Option value="Engineering">Engineering</Option>
                  <Option value="Marketing">Marketing</Option>
                  <Option value="Sales">Sales</Option>
                </Select>
              </div>

              {/* Status Select */}
              <div style={{ marginBottom: '16px' }}>
                <label>Status</label>
                <Select
                  placeholder="Select Status"
                  // value={formData.status}
                  onChange={(value) => handleSelectChange(value, 'status')}
                  style={{ width: '100%' }}
                >
                  <Option value="Active">Active</Option>
                  <Option value="Inactive">Inactive</Option>
                </Select>
              </div>


              <label>Date Of Joining</label>
              <div style={{ marginBottom: '16px' }}>
                <DatePicker
                  size="middle"
                  value={formData.dateOfJoining ? moment(formData.dateOfJoining, 'YYYY-MM-DD') : null} // Parse to moment
                  onChange={handleDateChange} // Use the date change handler
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD" // Format the date as needed
                />
              </div>


              <label>Probation End Date</label>
              <div style={{ marginBottom: '16px' }}>
                <DatePicker
                  size="middle"
                  value={formData.probationEndDate ? moment(formData.probationEndDate, 'YYYY-MM-DD') : null} // Parse to moment
                  onChange={handleDateChange1} // Use the date change handler
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD" // Format the date as needed
                />
              </div>

              {/* Profile Picture */}
              <div className="profile-picture-container">
                <label htmlFor="profile-picture-upload" className="profile-picture-label">
                  Profile Picture
                </label>
                <input
                  id="profile-picture-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="profile-picture-input"
                // style={{ display:"none"}}
                />
                {previewImage && (
                  <div className="profile-picture-preview">
                    <img
                      src={previewImage}
                      alt="Profile Preview"
                      className="profile-picture-image"
                    />
                    {/* <span className="profile-picture-caption">Preview</span> */}
                  </div>
                )}
              </div>
            </Modal>

            <Modal
              title={editMode ? 'Edit Employee' : 'Add Employee'}
              visible={isModalVisible1}
              onOk={handleSave}
              onCancel={handleCancel}
              okText={editMode ? 'Update' : 'Add'}
              className="modal-container"
            >
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                style={{ marginBottom: 10 }}
              />
              <Select
                value={formData.department}
                onChange={(value) => handleSelectChange(value, 'department')}
                placeholder="Select Department"
                style={{ width: '100%', marginBottom: 10 }}
              >
                <Option value="Engineering">Engineering</Option>
                <Option value="HR">HR</Option>
                <Option value="Sales">Sales</Option>
              </Select>
              <Select
                value={formData.status}
                onChange={(value) => handleSelectChange(value, 'status')}
                placeholder="Select Status"
                style={{ width: '100%', marginBottom: 10 }}
              >
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
              <input
                id="profile-picture-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="profile-picture-input"
              // style={{ display:"none"}}
              />
              <img
                src={formData.profilePicture || user}
                alt={formData.name}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  objectFit: 'scale-down',
                  border: '1px solid #ddd',
                }}
              />
            </Modal>

          </div>
        </CCard>
      </>

      {/* <WidgetsBrand className="mb-4" withCharts /> */}
      {/* <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Traffic {' & '} Sales</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-info py-1 px-3">
                        <div className="text-body-secondary text-truncate small">New Clients</div>
                        <div className="fs-5 fw-semibold">9,123</div>
                      </div>
                    </CCol>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">
                          Recurring Clients
                        </div>
                        <div className="fs-5 fw-semibold">22,643</div>
                      </div>
                    </CCol>
                  </CRow>
                  <hr className="mt-0" />
                  {progressGroupExample1.map((item, index) => (
                    <div className="progress-group mb-4" key={index}>
                      <div className="progress-group-prepend">
                        <span className="text-body-secondary small">{item.title}</span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="info" value={item.value1} />
                        <CProgress thin color="danger" value={item.value2} />
                      </div>
                    </div>
                  ))}
                </CCol>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">Pageviews</div>
                        <div className="fs-5 fw-semibold">78,623</div>
                      </div>
                    </CCol>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">Organic</div>
                        <div className="fs-5 fw-semibold">49,123</div>
                      </div>
                    </CCol>
                  </CRow>

                  <hr className="mt-0" />

                  {progressGroupExample2.map((item, index) => (
                    <div className="progress-group mb-4" key={index}>
                      <div className="progress-group-header">
                        <CIcon className="me-2" icon={item.icon} size="lg" />
                        <span>{item.title}</span>
                        <span className="ms-auto fw-semibold">{item.value}%</span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="warning" value={item.value} />
                      </div>
                    </div>
                  ))}

                  <div className="mb-5"></div>

                  {progressGroupExample3.map((item, index) => (
                    <div className="progress-group" key={index}>
                      <div className="progress-group-header">
                        <CIcon className="me-2" icon={item.icon} size="lg" />
                        <span>{item.title}</span>
                        <span className="ms-auto fw-semibold">
                          {item.value}{' '}
                          <span className="text-body-secondary small">({item.percent}%)</span>
                        </span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="success" value={item.percent} />
                      </div>
                    </div>
                  ))}
                </CCol>
              </CRow>

              <br />

              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">User</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Country
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Usage</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Payment Method
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Activity</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {tableExample.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-center">
                        <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.user.name}</div>
                        <div className="small text-body-secondary text-nowrap">
                          <span>{item.user.new ? 'New' : 'Recurring'}</span> | Registered:{' '}
                          {item.user.registered}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={item.country.flag} title={item.country.name} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex justify-content-between text-nowrap">
                          <div className="fw-semibold">{item.usage.value}%</div>
                          <div className="ms-3">
                            <small className="text-body-secondary">{item.usage.period}</small>
                          </div>
                        </div>
                        <CProgress thin color={item.usage.color} value={item.usage.value} />
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={item.payment.icon} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small text-body-secondary text-nowrap">Last login</div>
                        <div className="fw-semibold text-nowrap">{item.activity}</div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow> */}
    </>
  )
}

export default Dashboard
