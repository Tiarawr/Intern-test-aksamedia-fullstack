import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Users,
  Phone,
  Briefcase,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import Header from "./components/Header";
import EmployeeFormModal from "./components/EmployeeFormModal";
// import ApiService from "./services/api"; // Commented out until backend is ready

// Mock data - replace with real API calls later
const mockDivisions = [
  { id: 1, name: "Human Resources" },
  { id: 2, name: "Engineering" },
  { id: 3, name: "Marketing" },
  { id: 4, name: "Sales" },
  { id: 5, name: "Finance" },
];

const mockEmployees = [
  {
    id: 1,
    name: "John Doe",
    position: "Software Engineer",
    phone: "+62812345678",
    division: { id: 2, name: "Engineering" },
    image: null,
  },
  {
    id: 2,
    name: "Jane Smith",
    position: "HR Manager",
    phone: "+62823456789",
    division: { id: 1, name: "Human Resources" },
    image: null,
  },
  {
    id: 3,
    name: "Bob Johnson",
    position: "Marketing Specialist",
    phone: "+62834567890",
    division: { id: 3, name: "Marketing" },
    image: null,
  },
  {
    id: 4,
    name: "Alice Brown",
    position: "Sales Representative",
    phone: "+62845678901",
    division: { id: 4, name: "Sales" },
    image: null,
  },
  {
    id: 5,
    name: "Charlie Wilson",
    position: "Financial Analyst",
    phone: "+62856789012",
    division: { id: 5, name: "Finance" },
    image: null,
  },
  {
    id: 6,
    name: "Diana Davis",
    position: "Senior Developer",
    phone: "+62867890123",
    division: { id: 2, name: "Engineering" },
    image: null,
  },
];

function Notification({ show, type, title, message, onClose }) {
  return (
    <div
      className={`fixed top-4 right-4 z-50 min-w-80 px-4 py-3 rounded-lg shadow-lg border flex items-center space-x-3 transition-all duration-300 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      } ${
        type === "error"
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-green-200 bg-green-50 text-green-800"
      }`}
    >
      <div className="flex-shrink-0">
        {type === "error" ? (
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        ) : (
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
      </div>
      <div>
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs mt-1 opacity-90">{message}</div>
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-gray-400 hover:text-gray-600"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Mock state for data (replace with API data later)
  const [employees, setEmployees] = useState(mockEmployees);
  const [divisions, setDivisions] = useState(mockDivisions);
  const [isLoading, setIsLoading] = useState(false);

  // Notification state
  const [notif, setNotif] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
  });
  const notifTimeout = useRef();

  // Check initial theme and listen for changes
  useEffect(() => {
    const checkTheme = () => {
      const hasDarkClass = document.documentElement.classList.contains("dark");
      setIsDarkMode(hasDarkClass);
    };

    checkTheme();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Mock data loading (replace with real API calls)
  useEffect(() => {
    // Simulate loading delay
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  // Filter employees based on search and division
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = employee.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDivision = selectedDivision
      ? employee.division.id.toString() === selectedDivision
      : true;
    return matchesSearch && matchesDivision;
  });

  // Pagination logic
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const pagination = {
    current_page: currentPage,
    last_page: totalPages,
    per_page: itemsPerPage,
    total: filteredEmployees.length,
  };

  // Show notification
  const showNotification = (type, title, message) => {
    setNotif({ show: true, type, title, message });
    clearTimeout(notifTimeout.current);
    notifTimeout.current = setTimeout(
      () => setNotif((n) => ({ ...n, show: false })),
      4000
    );
  };

  // CRUD Functions (mock implementations)
  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = async (employee) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${employee.name}?`)) {
      // Mock delete - remove from local state
      setEmployees((prev) => prev.filter((emp) => emp.id !== employee.id));
      showNotification(
        "success",
        "Berhasil",
        `${employee.name} berhasil dihapus`
      );
    }
  };

  const handleFormSuccess = (action, employeeData) => {
    if (action === "created") {
      // Mock create - add to local state
      const newEmployee = {
        ...employeeData,
        id: Math.max(...employees.map((e) => e.id)) + 1,
        division: divisions.find(
          (d) => d.id === parseInt(employeeData.division_id)
        ),
      };
      setEmployees((prev) => [...prev, newEmployee]);
      showNotification("success", "Berhasil", "Karyawan berhasil ditambahkan");
    } else {
      // Mock update - update in local state
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === editingEmployee.id
            ? {
                ...emp,
                ...employeeData,
                division: divisions.find(
                  (d) => d.id === parseInt(employeeData.division_id)
                ),
              }
            : emp
        )
      );
      showNotification(
        "success",
        "Berhasil",
        "Data karyawan berhasil diupdate"
      );
    }
    setIsModalOpen(false);
  };

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDivision]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    // Mock logout
    showNotification("success", "Logout", "Anda berhasil logout");
    // In real app, this would redirect to login
    console.log("Logout clicked");
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <Header showUserMenu={true} onLogout={handleLogout} />

      {/* Notification */}
      <Notification
        show={notif.show}
        type={notif.type}
        title={notif.title}
        message={notif.message}
        onClose={() => setNotif((n) => ({ ...n, show: false }))}
      />

      {/* Employee Form Modal */}
      <EmployeeFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employee={editingEmployee}
        divisions={divisions}
        onSuccess={handleFormSuccess}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1
                className={`text-3xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                } mb-2`}
              >
                Employee Directory
              </h1>
              <p
                className={`text-lg ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Kelola informasi karyawan dengan mudah
              </p>
            </div>

            {/* Add Employee Button */}
            <div className="mt-4 sm:mt-0">
              <button
                onClick={handleAddEmployee}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Tambah Karyawan
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search
                className={`w-5 h-5 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
            </div>
            <input
              type="text"
              placeholder="Cari nama karyawan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
          </div>

          {/* Division Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter
                className={`w-5 h-5 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
            </div>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className={`pl-10 pr-8 py-3 border rounded-lg ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value="">Semua Divisi</option>
              {divisions.map((division) => (
                <option key={division.id} value={division.id}>
                  {division.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            className={`p-6 rounded-lg border ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {employees.length}
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Total Karyawan
                </p>
              </div>
            </div>
          </div>

          <div
            className={`p-6 rounded-lg border ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {divisions.length}
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Total Divisi
                </p>
              </div>
            </div>
          </div>

          <div
            className={`p-6 rounded-lg border ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p
                  className={`text-2xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {filteredEmployees.length}
                </p>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Hasil Pencarian
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p
              className={`mt-2 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Memuat data...
            </p>
          </div>
        )}

        {/* Employee Cards Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedEmployees.map((employee) => (
              <div
                key={employee.id}
                className={`p-6 rounded-lg border hover:shadow-lg transition-all duration-200 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                {/* Header with Avatar */}
                <div className="flex items-center mb-4">
                  <img
                    src={
                      employee.image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        employee.name
                      )}&background=6366f1&color=fff`
                    }
                    alt={employee.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-3 flex-1">
                    <h3
                      className={`text-lg font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {employee.name}
                    </h3>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 ml-2">
                    <button
                      onClick={() => handleEditEmployee(employee)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        isDarkMode
                          ? "text-gray-400 hover:text-blue-400 hover:bg-gray-700"
                          : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                      title="Edit Karyawan"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEmployee(employee)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        isDarkMode
                          ? "text-gray-400 hover:text-red-400 hover:bg-gray-700"
                          : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                      }`}
                      title="Hapus Karyawan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Employee Details */}
                <div className="space-y-3">
                  {/* Division and Position */}
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Briefcase
                        className={`w-4 h-4 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                      <p
                        className={`font-medium ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {employee.division?.name || "No Division"}
                      </p>
                    </div>
                    <p
                      className={`text-sm ml-6 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {employee.position}
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="flex items-center space-x-2">
                    <Phone
                      className={`w-4 h-4 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {employee.phone}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && pagination.last_page > 1 && (
          <div className="flex items-center justify-between">
            <div
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Menampilkan{" "}
              {(pagination.current_page - 1) * pagination.per_page + 1} -{" "}
              {Math.min(
                pagination.current_page * pagination.per_page,
                pagination.total
              )}{" "}
              dari {pagination.total} karyawan
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                } ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex space-x-1">
                {Array.from(
                  { length: Math.min(pagination.last_page, 5) },
                  (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : isDarkMode
                            ? "text-gray-400 hover:text-white hover:bg-gray-700"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.last_page}
                className={`p-2 rounded-lg ${
                  currentPage === pagination.last_page
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                } ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* No Results Message */}
        {!isLoading && paginatedEmployees.length === 0 && (
          <div className="text-center py-12">
            <Search
              className={`w-12 h-12 mx-auto mb-4 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <h3
              className={`text-xl font-semibold mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Tidak ada hasil ditemukan
            </h3>
            <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Coba ubah kata kunci pencarian atau filter Anda
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDivision("");
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Reset Filter
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
