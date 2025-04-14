import React, { useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  X,
  CheckCircle,
  XCircle,
  Eye,
  Trash,
  Plus,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  MoreVertical,
  Calendar,
  DollarSign,
  Briefcase,
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  User,
  Clock,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import useAxios from "../hooks/useAxios.js";

const Jobs = () => {
  const axios = useAxios();
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [jobDetailsModal, setJobDetailsModal] = useState(null);
  const [jobCreator, setJobCreator] = useState(null);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Filters
  const [selectedCompany, setSelectedCompany] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");

  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    totalJobs: 0,
  });

  // Job types for dropdown
  const jobTypes = [
    { value: "all", label: "All Job Types" },
    { value: "onsite", label: "On-site" },
    { value: "remote", label: "Remote" },
    { value: "hybrid", label: "Hybrid" },
  ];

  // Status options for dropdown
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "open", label: "Active" },
    { value: "closed", label: "Closed" },
  ];

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("/admin/companies");
        setCompanies(response.data.companies || []);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, [axios]);

  useEffect(() => {
    let isMounted = true;

    const fetchJobs = async () => {
      setLoading(true);

      let endPoint = "/admin/jobs";

      try {
        if (selectedCompany) {
          endPoint = `/admin/jobs/company/${selectedCompany}`;
        }

        const params = new URLSearchParams();
        params.append("page", pagination.currentPage);
        params.append("limit", pagination.pageSize);
        params.append("sort", "createdAt");
        params.append("order", "desc");

        if (searchTerm) {
          params.append("search", searchTerm);
        }

        if (statusFilter !== "all") {
          params.append("status", statusFilter);
        }

        if (jobTypeFilter !== "all") {
          params.append("jobType", jobTypeFilter);
        }

        const response = await axios.get(`${endPoint}?${params.toString()}`);

        if (isMounted) {
          setJobs(response.data.jobs || []);
          setPagination(response.data.pagination || pagination);
          setError(null);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        if (isMounted) {
          setError("Failed to fetch jobs. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchJobs();

    return () => {
      isMounted = false;
    };
  }, [
    selectedCompany,
    pagination.currentPage,
    statusFilter,
    jobTypeFilter,
    searchTerm,
    axios,
  ]);

  const handleJobStatusChange = async (jobId, newStatus) => {
    try {
      await axios.post(
        `/admin/jobs/${jobId}/${newStatus === "open" ? "reopen" : "close"}`
      );

      // Update job in local state
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId ? { ...job, status: newStatus } : job
        )
      );
    } catch (error) {
      console.error(`Error updating job status:`, error);
      alert(
        `Failed to ${
          newStatus === "open" ? "reopen" : "close"
        } job. Please try again.`
      );
    }
  };

  const deleteJob = async (jobId) => {
    try {
      await axios.delete(`/admin/jobs/${jobId}`);

      // Remove job from local state
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      setConfirmDelete(null);
    } catch (error) {
      console.error(`Error deleting job:`, error);
      alert("Failed to delete job. Please try again.");
    }
  };

  const fetchJobDetails = async (jobId) => {
    setLoadingDetails(true);
    try {
      const jobResponse = await axios.get(`/admin/jobs/job/${jobId}`);
      console.log("jobResponse" , jobResponse);
      
      setJobDetailsModal(jobResponse.data.job);
  
      if (jobResponse.data.job?.createdBy?._id) {
        try {
          const userResponse = await axios.get(
            `/admin/users/${jobResponse.data.job.createdBy._id}`
          );
          console.log(userResponse)
          setJobCreator(userResponse.data.user);
        } catch (error) {
          console.error("Error fetching job creator details:", error);
        }
      }
  
      if (jobResponse.data.job?.companyId?._id) {
        try {
          const companyResponse = await axios.get(
            `/admin/companies/${jobResponse.data.job.companyId._id}`
          );
          console.log(companyResponse)
          setCompanyDetails(companyResponse.data.company);
        } catch (error) {
          console.error("Error fetching company details:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
      alert("Failed to load job details. Please try again.");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Reset to first page when applying a new search
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    // Search is applied via the useEffect dependency
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCompany("");
    setSearchTerm("");
    setStatusFilter("all");
    setJobTypeFilter("all");
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Handle pagination
  const changePage = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  const formatLocation = (job) => {
    if (!job.location) return "Location not specified";

    if (typeof job.location === "string") {
      return job.location;
    }

    // Handle location object structure from backend
    const { city, state, country, jobType } = job.location;
    const locationParts = [city, state, country].filter(Boolean).join(", ");

    const jobTypeLabel = jobType
      ? ` (${jobType.charAt(0).toUpperCase() + jobType.slice(1)})`
      : "";

    return locationParts + jobTypeLabel || "Remote";
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return "Not specified";

    const formatNumber = (num) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(num);
    };

    if (min && max) {
      return `${formatNumber(min)} - ${formatNumber(max)}`;
    } else if (min) {
      return `From ${formatNumber(min)}`;
    } else {
      return `Up to ${formatNumber(max)}`;
    }
  };

  // Toggle dropdown menu visibility
  const toggleDropdown = (jobId, e) => {
    // Prevent event from bubbling up
    if (e) {
      e.stopPropagation();
    }
    
    if (activeDropdown === jobId) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(jobId);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Close modals when pressing Escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        if (jobDetailsModal) {
          setJobDetailsModal(null);
          setJobCreator(null);
          setCompanyDetails(null);
        }
        if (confirmDelete) {
          setConfirmDelete(null);
        }
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [jobDetailsModal, confirmDelete]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Job Management</h1>
          <p className="text-gray-600">
            Manage all job listings across the platform
          </p>
        </div>
        <Link
          to="/admin/jobs/create"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="h-5 w-5" />
          Create New Job
        </Link>
      </header>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Jobs
            </label>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search by job title..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>
          </div>

          {/* Company Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="">All Companies</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Status
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Job Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Type
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
            >
              {jobTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset Filters Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={resetFilters}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset Filters
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* No Jobs Found */}
      {!loading && !error && jobs.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No jobs found
          </h3>
          <p className="text-gray-500">
            {selectedCompany ||
            searchTerm ||
            statusFilter !== "all" ||
            jobTypeFilter !== "all"
              ? "Try adjusting your filters to see more results."
              : "There are no jobs in the system yet."}
          </p>
        </div>
      )}

      {/* Jobs Table */}
      {!loading && !error && jobs.length > 0 && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posted Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {job.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {job.skills && job.skills.length > 0
                          ? job.skills.slice(0, 3).join(", ") +
                            (job.skills.length > 3 ? "..." : "")
                          : "No skills listed"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {job.companyId ? (
                        <div className="flex items-center">
                          {job.companyId.logo && (
                            <img
                              src={job.companyId.logo}
                              alt={job.companyId.name}
                              className="h-8 w-8 rounded-full mr-2 object-cover"
                            />
                          )}
                          <div className="text-sm text-gray-900">
                            {job.companyId.name}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">N/A</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatLocation(job)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(job.createdAt || job.postedDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {job.applicants
                          ? job.applicants
                          : job.applicants_list
                          ? job.applicants_list.length
                          : 0}{" "}
                        / {job.openings || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          job.status === "open" || job.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {job.status === "open" || job.status === "active"
                          ? "Active"
                          : "Closed"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
                      <div className="flex items-center">
                        <button
                          onClick={(e) => toggleDropdown(job._id, e)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeDropdown === job._id && (
                          <div
                            className="absolute right-6 mt-2 z-10 w-48 py-1 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                fetchJobDetails(job._id);
                                setActiveDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </button>

                            <Link
                              to={`/admin/jobs/${job._id}`}
                              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Edit Job
                            </Link>

                            {job.status === "open" ||
                            job.status === "active" ? (
                              <button
                                onClick={() => {
                                  handleJobStatusChange(job._id, "closed");
                                  setActiveDropdown(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-gray-100 flex items-center"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Close Job
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  handleJobStatusChange(job._id, "open");
                                  setActiveDropdown(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100 flex items-center"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Reopen Job
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setConfirmDelete(job._id);
                                setActiveDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Delete Job
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => changePage(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  pagination.currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => changePage(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  pagination.currentPage === pagination.totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {jobs.length
                      ? (pagination.currentPage - 1) * pagination.pageSize + 1
                      : 0}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      pagination.currentPage * pagination.pageSize,
                      pagination.totalJobs
                    )}
                  </span>{" "}
                  of <span className="font-medium">{pagination.totalJobs}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => changePage(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      pagination.currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {/* Page numbers logic */}
                  {[...Array(pagination.totalPages)].map((_, idx) => {
                    const pageNumber = idx + 1;
                    // Only show current page, first, last, and pages close to current
                    const showPage =
                      pageNumber === 1 ||
                      pageNumber === pagination.totalPages ||
                      Math.abs(pageNumber - pagination.currentPage) <= 1;

                    if (
                      !showPage &&
                      Math.abs(pageNumber - pagination.currentPage) === 2
                    ) {
                      return (
                        <span
                          key={`ellipsis-${pageNumber}`}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }

                    return showPage ? (
                      <button
                        key={pageNumber}
                        onClick={() => changePage(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          pageNumber === pagination.currentPage
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                        } text-sm font-medium`}
                      >
                        {pageNumber}
                      </button>
                    ) : null;
                  })}

                  <button
                    onClick={() => changePage(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      pagination.currentPage === pagination.totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this job? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteJob(confirmDelete)}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
              >
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Details Modal */}
      {jobDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-8" onClick={(e) => e.target === e.currentTarget && setJobDetailsModal(null)}>
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-y-auto m-4" onClick={(e) => e.stopPropagation()}>
          {loadingDetails ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
            ) : (
              <>
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {jobDetailsModal.title}
                  </h2>
                  <button
                    onClick={() => {
                      setJobDetailsModal(null);
                      setJobCreator(null);
                      setCompanyDetails(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {/* Modal Content */}
                <div className="px-6 py-4">
                  {/* Job Overview Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
                      Job Overview
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div>
                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-1">Company</p>
                          <div className="flex items-center">
                            {jobDetailsModal.companyId?.logo && (
                              <img
                                src={jobDetailsModal.companyId.logo}
                                alt={jobDetailsModal.companyId.name}
                                className="h-10 w-10 rounded-full mr-3 object-cover"
                              />
                            )}
                            <span className="font-medium">
                              {jobDetailsModal.companyId?.name || "N/A"}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-1">Job Type</p>
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                            <span>
                              {jobDetailsModal.location?.jobType
                                ? jobDetailsModal.location.jobType
                                    .charAt(0)
                                    .toUpperCase() +
                                  jobDetailsModal.location.jobType.slice(1)
                                : typeof jobDetailsModal.location ===
                                    "object" && jobDetailsModal.location?.city
                                ? "On-site"
                                : "Not specified"}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-1">Location</p>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                            <span>{formatLocation(jobDetailsModal)}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-1">
                            Salary Range
                          </p>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                            <span>
                              {formatSalary(
                                jobDetailsModal.min_salary,
                                jobDetailsModal.max_salary
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div>
                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-1">
                            Posted Date
                          </p>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <span>
                              {formatDate(
                                jobDetailsModal.postedDate ||
                                  jobDetailsModal.createdAt
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-1">
                            Application Deadline
                          </p>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                            <span>
                              {jobDetailsModal.applicationDeadline
                                ? formatDate(
                                    jobDetailsModal.applicationDeadline
                                  )
                                : "No deadline specified"}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-1">Openings</p>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-gray-400 mr-2" />
                            <span>
                              {jobDetailsModal.openings || "Not specified"}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-1">
                            Applications
                          </p>
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <span>
                              {jobDetailsModal.applicants
                                ? jobDetailsModal.applicants
                                : jobDetailsModal.applicants_list
                                ? jobDetailsModal.applicants_list.length
                                : 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Job Description */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
                      Job Description
                    </h3>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-line">
                        {jobDetailsModal.description ||
                          "No description provided."}
                      </p>
                    </div>
                  </div>

                  {/* Requirements & Skills */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Requirements */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
                        Requirements
                      </h3>
                      {jobDetailsModal.requirement &&
                      jobDetailsModal.requirement.length > 0 ? (
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                          {jobDetailsModal.requirement.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">
                          No specific requirements listed.
                        </p>
                      )}
                    </div>

                    {/* Skills */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
                        Skills
                      </h3>
                      {jobDetailsModal.skills &&
                      jobDetailsModal.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {jobDetailsModal.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">
                          No specific skills listed.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Posted By */}
                  {/* <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
                      Posted By
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <User className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="font-medium">
                          {jobDetailsModal.createdBy?.name ||
                            jobDetailsModal.createdBy?.email ||
                            "Unknown User"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="text-gray-600">
                          {jobDetailsModal.createdBy?.email ||
                            "Email not available"}
                        </span>
                      </div>
                      {jobCreator && (
                        <div className="mt-2 text-sm text-gray-500">
                          {jobCreator.role && (
                            <p>
                              Role:{" "}
                              {jobCreator.role.charAt(0).toUpperCase() +
                                jobCreator.role.slice(1)}
                            </p>
                          )}
                          {jobCreator.createdAt && (
                            <p>
                              User registered on:{" "}
                              {formatDate(jobCreator.createdAt)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div> */}

                  {/* Company Information */}
                  {companyDetails && (
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
                        Company Information
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start mb-3">
                          {companyDetails.logo && (
                            <img
                              src={companyDetails.logo}
                              alt={companyDetails.name}
                              className="h-12 w-12 rounded-lg mr-3 object-cover"
                            />
                          )}
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {companyDetails.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {companyDetails.industry}
                            </p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            About
                          </p>
                          <p className="text-sm text-gray-600">
                            {companyDetails.description ||
                              "No company description available."}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Company Type
                            </p>
                            <p className="text-sm text-gray-600">
                              {companyDetails.companyType || "Not specified"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Founded
                            </p>
                            <p className="text-sm text-gray-600">
                              {companyDetails.founded
                                ? formatDate(companyDetails.founded)
                                : "Not specified"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Size
                            </p>
                            <p className="text-sm text-gray-600 capitalize">
                              {companyDetails.size || "Not specified"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Location
                            </p>
                            <p className="text-sm text-gray-600">
                              {companyDetails.location || "Not specified"}
                            </p>
                          </div>

                          {companyDetails.website && (
                            <div className="col-span-2">
                              <p className="text-sm font-medium text-gray-700 mb-1">
                                Website
                              </p>
                              <div className="flex items-center">
                                <Globe className="h-4 w-4 text-gray-400 mr-2" />
                                <a
                                  href={companyDetails.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline"
                                >
                                  {companyDetails.website}
                                </a>
                              </div>
                            </div>
                          )}

                          {companyDetails.headquarter &&
                            companyDetails.headquarter.length > 0 && (
                              <div className="col-span-2">
                                <p className="text-sm font-medium text-gray-700 mb-1">
                                  Headquarters
                                </p>
                                <p className="text-sm text-gray-600">
                                  {companyDetails.headquarter.join(", ")}
                                </p>
                              </div>
                            )}

                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Contact Email
                            </p>
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-600">
                                {companyDetails.contact_email || "Not provided"}
                              </span>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Contact Phone
                            </p>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-600">
                                {companyDetails.contact_phone || "Not provided"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                  {jobDetailsModal.status === "open" ||
                  jobDetailsModal.status === "active" ? (
                    <button
                      onClick={() => {
                        handleJobStatusChange(jobDetailsModal._id, "closed");
                        setJobDetailsModal(null);
                      }}
                      className="bg-amber-100 hover:bg-amber-200 text-amber-700 font-medium py-2 px-4 rounded-lg flex items-center gap-2"
                    >
                      <XCircle className="h-5 w-5" />
                      Close Job
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleJobStatusChange(jobDetailsModal._id, "open");
                        setJobDetailsModal(null);
                      }}
                      className="bg-green-100 hover:bg-green-200 text-green-700 font-medium py-2 px-4 rounded-lg flex items-center gap-2"
                    >
                      <CheckCircle className="h-5 w-5" />
                      Reopen Job
                    </button>
                  )}

                  <Link
                    to={`/admin/jobs/${jobDetailsModal._id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2"
                  >
                    <FileText className="h-5 w-5" />
                    Edit Job
                  </Link>

                  <button
                    onClick={() => {
                      setConfirmDelete(jobDetailsModal._id);
                      setJobDetailsModal(null);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2"
                  >
                    <Trash className="h-5 w-5" />
                    Delete Job
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
