import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import {
  Search,
  Users,
  Phone,
  Briefcase,
  Plus,
  Edit,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import Header from "./components/Header";
import EmployeeFormModal from "./components/EmployeeFormModal";
import DivisionManagement from "./components/DivisionManagement";
import { employeesAPI, divisionsAPI } from "../services/api";

function Notification({ show, type, title, message, onClose }) {
  return (
    <div
      className={`fixed top-[4rem] right-4 z-50 min-w-80 px-4 py-3 rounded-lg shadow-lg border flex items-center space-x-3 transition-all duration-300 ${
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

// Enhanced Pagination Component
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}) {
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
      {/* Pagination Info */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Menampilkan <span className="font-semibold">{startItem}</span> hingga{" "}
        <span className="font-semibold">{endItem}</span> dari{" "}
        <span className="font-semibold">{totalItems}</span> karyawan
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center space-x-1">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 border ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-600"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
          }`}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1 mx-2">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="px-3 py-2 text-gray-400 dark:text-gray-500">
                  <MoreHorizontal className="w-4 h-4" />
                </span>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    currentPage === page
                      ? "bg-blue-600 text-white shadow-md ring-1 ring-blue-600"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 border ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 border-gray-300 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 dark:border-gray-600"
          }`}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath; // Already full URL
  const fullUrl = `http://127.0.0.1:8000/storage/${imagePath}`;
  return fullUrl;
};

// Dashboard component - Updated to fix data loading and authentication
export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  // Get initial state from URL parameters
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedDivision, setSelectedDivision] = useState(
    searchParams.get("division") || ""
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // API state
  const [employees, setEmployees] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 3,
    total: 0,
  });

  // Tab state
  const [activeTab, setActiveTab] = useState("employees");

  // Notification state
  const [notif, setNotif] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
  });
  const notifTimeout = useRef();

  // Update URL parameters when state changes
  const updateURLParams = (params) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  // Load data from API
  const loadData = async () => {
    try {
      setIsLoading(true);

      // Load divisions first (doesn't require auth for basic info)
      try {
        const divisionsRes = await divisionsAPI.getAll();
        setDivisions(divisionsRes.data?.divisions || []);
      } catch (error) {
        setDivisions([]); // Fallback to empty array
      }

      // Load employees with server-side pagination
      try {
        const employeesRes = await employeesAPI.getAll({
          page: currentPage,
          name: searchQuery,
          division_id: selectedDivision,
          per_page: 3, // Use smaller page size to show pagination
        });
        setEmployees(employeesRes.data?.employees || []);
        setPagination(
          employeesRes.pagination || {
            current_page: 1,
            last_page: 1,
            per_page: 3,
            total: 0,
          }
        );
      } catch (error) {
        setEmployees([]); // Fallback to empty array
        showNotification("error", "Error", "Failed to load employees data");
      }
    } catch (error) {
      showNotification("error", "Error", "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount and when parameters change
  useEffect(() => {
    loadData(); // Enable real API calls
  }, [currentPage, searchQuery, selectedDivision]);

  // Update URL when state changes
  useEffect(() => {
    updateURLParams({
      search: searchQuery,
      division: selectedDivision,
      page: currentPage > 1 ? currentPage : null,
    });
  }, [searchQuery, selectedDivision, currentPage]);

  // Show notification
  const showNotification = (type, title, message) => {
    setNotif({ show: true, type, title, message });
    clearTimeout(notifTimeout.current);
    notifTimeout.current = setTimeout(
      () => setNotif((n) => ({ ...n, show: false })),
      4000
    );
  };

  // Use server-side pagination - no client-side filtering needed
  const displayedEmployees = employees || [];

  // Use pagination metadata from server
  const itemsPerPage = pagination.per_page;
  const totalPages = pagination.last_page;
  const totalItems = pagination.total;
  const currentPageFromServer = pagination.current_page;

  // CRUD Functions
  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleFormSuccess = async (action, employeeData) => {
    if (action === "created") {
      showNotification("success", "Berhasil", "Karyawan berhasil ditambahkan");
      // Reset ke halaman 1 untuk melihat data terbaru
      setCurrentPage(1);
    } else {
      showNotification(
        "success",
        "Berhasil", 
        "Data karyawan berhasil diupdate"
      );
    }

    // Reload data from server to get latest data
    setIsModalOpen(false);
    setEditingEmployee(null);
    
    // Delay untuk memastikan modal tertutup sebelum reload
    setTimeout(() => {
      loadData();
    }, 100);
  };

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDivision]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      showNotification("error", "Error", "Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <Header />

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
        {/* Header Section with Tabs */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Management Dashboard
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Kelola karyawan dan divisi perusahaan
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("employees")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "employees"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Karyawan
                </div>
              </button>
              <button
                onClick={() => setActiveTab("divisions")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "divisions"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Divisi
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "employees" && (
          <>
            {/* Add Employee Button */}
            <div className="mb-6 flex justify-end">
              <button
                onClick={handleAddEmployee}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5 mr-2" />
                Tambah Karyawan
              </button>
            </div>

            {/* Search and Filter Bar */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cari nama karyawan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-xl transition-all duration-200 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              {/* Division Filter */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="pl-10 pr-8 py-3 border rounded-xl transition-all duration-200 min-w-[200px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none"
                >
                  <option value="">Semua Divisi</option>
                  {(divisions || []).map((division) => (
                    <option key={division.id} value={division.id}>
                      {division.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 rounded-xl border transition-all duration-200 hover:shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {(employees || []).length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Karyawan
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl border transition-all duration-200 hover:shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {(divisions || []).length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Divisi
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Memuat data...
                </p>
              </div>
            )}

            {/* Employee Cards Grid */}
            {!isLoading && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {displayedEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      className="p-6 rounded-xl border transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                    >
                      {/* Header with Avatar */}
                      <div className="flex items-center mb-4">
                        <img
                          src={
                            getImageUrl(employee.image) ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              employee.name
                            )}&background=6366f1&color=fff&size=48`
                          }
                          alt={employee.name}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            // Fallback to avatar if image fails to load
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              employee.name
                            )}&background=6366f1&color=fff&size=48`;
                          }}
                        />
                        <div className="ml-3 flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {employee.name}
                          </h3>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2 ml-2">
                          <button
                            onClick={() => handleEditEmployee(employee)}
                            className="p-2 rounded-lg transition-all duration-200 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-gray-700"
                            title="Edit Karyawan"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Employee Details */}
                      <div className="space-y-3">
                        {/* Division and Position */}
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <Briefcase className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <p className="font-medium text-gray-900 dark:text-white">
                              {employee.division?.name || "No Division"}
                            </p>
                          </div>
                          <p className="text-sm ml-6 text-gray-600 dark:text-gray-400">
                            {employee.position}
                          </p>
                        </div>

                        {/* Contact Info */}
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {employee.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Enhanced Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                />
              </>
            )}

            {/* No Results Message */}
            {!isLoading && displayedEmployees.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-500 dark:text-gray-400" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  Tidak ada hasil ditemukan
                </h3>
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                  Coba ubah kata kunci pencarian atau filter Anda
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedDivision("");
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </>
        )}

        {/* Divisions Tab Content */}
        {activeTab === "divisions" && <DivisionManagement />}
      </main>

      {/* Test Components */}
    </div>
  );
}
