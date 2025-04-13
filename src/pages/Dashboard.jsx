import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Users,
  Activity,
  FileText,
  ArrowUp,
  ArrowDown,
  Clock,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Bell,
  Search,
  Sliders,
  Calendar,
  Download,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [showJobOptions, setShowJobOptions] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState("today");
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState("Naukari Marg");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  const [statistics, setStatistics] = useState([
    {
      id: 1,
      title: "Active Jobs",
      count: 248,
      change: 12,
      trend: "up",
      icon: Briefcase,
      color: "blue",
    },
    {
      id: 2,
      title: "New Applicants",
      count: 43,
      change: 8,
      trend: "up",
      icon: Users,
      color: "green",
    },
    {
      id: 3,
      title: "Employers",
      count: 128,
      change: 3,
      trend: "up",
      icon: Activity,
      color: "purple",
    },
    {
      id: 4,
      title: "Hired Today",
      count: 12,
      change: 2,
      trend: "down",
      icon: FileText,
      color: "yellow",
    },
  ]);

  const [activities, setActivities] = useState([
    {
      id: 1,
      event: "New employer registered",
      details: "Tech Solutions Inc.",
      time: "15 minutes ago",
      icon: Users,
      color: "green",
    },
    {
      id: 2,
      event: "New job posted",
      details: "Senior Developer at WebCorp",
      time: "45 minutes ago",
      icon: Briefcase,
      color: "blue",
    },
    {
      id: 3,
      event: "Applicant hired",
      details: "John Doe hired at Digital Solutions",
      time: "2 hours ago",
      icon: Activity,
      color: "yellow",
    },
    {
      id: 4,
      event: "Resume updated",
      details: "Sarah Johnson updated resume",
      time: "3 hours ago",
      icon: FileText,
      color: "purple",
    },
  ]);

  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Frontend Developer",
      company: "Tech Solutions Inc.",
      location: "Remote",
      posted: "2 days ago",
      status: "Active",
      applicants: 18,
    },
    {
      id: 2,
      title: "UX Designer",
      company: "Design Hub Co.",
      location: "New York, NY",
      posted: "3 days ago",
      status: "Active",
      applicants: 12,
    },
    {
      id: 3,
      title: "Full Stack Developer",
      company: "WebCorp",
      location: "San Francisco, CA",
      posted: "1 week ago",
      status: "Reviewing",
      applicants: 32,
    },
    {
      id: 4,
      title: "DevOps Engineer",
      company: "Cloud Systems Ltd.",
      location: "Remote",
      posted: "1 week ago",
      status: "Closed",
      applicants: 24,
    },
  ]);

  const applicationData = [
    { name: "Jan", applications: 65 },
    { name: "Feb", applications: 78 },
    { name: "Mar", applications: 90 },
    { name: "Apr", applications: 81 },
    { name: "May", applications: 95 },
    { name: "Jun", applications: 110 },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    setNotifications([
      {
        id: 1,
        text: "New applicant for Frontend Developer position",
        time: "10 minutes ago",
      },
      {
        id: 2,
        text: "Interview scheduled with Sarah Johnson",
        time: "1 hour ago",
      },
      { id: 3, text: "Job posting expires tomorrow", time: "3 hours ago" },
    ]);

    return () => clearTimeout(timer);
  }, []);

  const filteredJobs = jobs
    .filter((job) => {
      if (activeFilter === "all") return true;
      return job.status.toLowerCase() === activeFilter;
    })
    .filter((job) => {
      if (!searchQuery) return true;
      return (
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  const handleTimeRangeChange = (range) => {
    setSelectedTimeRange(range);
    const updatedStats = [...statistics];

    if (range === "today") {
      updatedStats[0].count = 248;
      updatedStats[1].count = 43;
    } else if (range === "week") {
      updatedStats[0].count = 782;
      updatedStats[1].count = 156;
    } else if (range === "month") {
      updatedStats[0].count = 3248;
      updatedStats[1].count = 587;
    }

    setStatistics(updatedStats);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleCreateJob = () => {
    alert("Navigating to create new job form");
    setShowActionMenu(false);
  };

  const handleExportData = () => {
    alert("Exporting dashboard data");
    setShowActionMenu(false);
  };

  const handleJobAction = (jobId, action) => {
    if (action === "view") {
      alert(`Viewing details for job #${jobId}`);
    } else if (action === "edit") {
      alert(`Editing job #${jobId}`);
    } else if (action === "applicants") {
      alert(`Viewing applicants for job #${jobId}`);
    } else if (action === "deactivate") {
      const updatedJobs = jobs.map((job) =>
        job.id === jobId ? { ...job, status: "Closed" } : job
      );
      setJobs(updatedJobs);
    }
    setShowJobOptions(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Reviewing":
        return "bg-yellow-100 text-yellow-800";
      case "Closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getBgColor = (color) => {
    switch (color) {
      case "blue":
        return "bg-blue-100 text-blue-600";
      case "green":
        return "bg-green-100 text-green-600";
      case "purple":
        return "bg-purple-100 text-purple-600";
      case "yellow":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  useEffect(() => {
    const closeDropdowns = () => {
      setShowJobOptions(null);
      setShowActionMenu(false);
      setShowNotifications(false);
    };

    document.addEventListener("click", closeDropdowns);
    return () => document.removeEventListener("click", closeDropdowns);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-gray-50 min-h-screen p-6"
    >
      {/* Header with company branding */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between mb-6"
      >
        <h1 className="text-2xl font-semibold text-gray-900">
          {companyName} Dashboard
        </h1>
        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              className="relative p-2 text-gray-600 hover:text-gray-900 bg-white rounded-full shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowNotifications(!showNotifications);
              }}
            >
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                  {notifications.length}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10 overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-3 border-b border-gray-200">
                    <h3 className="font-medium">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      >
                        <p className="text-sm text-gray-800">
                          {notification.text}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.time}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                  <div className="p-2 bg-gray-50 border-t border-gray-100">
                    <button className="w-full text-sm text-blue-600 hover:text-blue-800 p-1">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Time range selector */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center space-x-2 bg-white rounded-md p-2 shadow-sm cursor-pointer">
              <Clock className="h-4 w-4 text-gray-500" />
              <select
                className="text-sm focus:outline-none border-0 bg-transparent cursor-pointer"
                value={selectedTimeRange}
                onChange={(e) => handleTimeRangeChange(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">Last 3 Months</option>
              </select>
            </div>
          </div>

          {/* Actions menu */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              className="flex items-center space-x-2 bg-blue-600 text-white rounded-md px-4 py-2 shadow-sm hover:bg-blue-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setShowActionMenu(!showActionMenu);
              }}
            >
              <span>Actions</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            <AnimatePresence>
              {showActionMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
                >
                  <div className="py-1">
                    <button
                      onClick={handleCreateJob}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-2" />
                        Create New Job
                      </div>
                    </button>
                    <button
                      onClick={handleExportData}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </div>
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Report
                      </div>
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <div className="flex items-center">
                        <Sliders className="h-4 w-4 mr-2" />
                        Dashboard Settings
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Statistics cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
      >
        {statistics.map((stat) => (
          <motion.div
            key={stat.id}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white rounded-lg shadow p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex justify-between">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${getBgColor(stat.color)}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>
                  <motion.p
                    key={stat.count}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-semibold text-gray-900"
                  >
                    {stat.count}
                  </motion.p>
                </div>
              </div>
              <div
                className={`self-start flex items-center text-sm ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.trend === "up" ? (
                  <ArrowUp className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 mr-1" />
                )}
                {stat.change}%
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Application trend chart */}
      <motion.div
        variants={itemVariants}
        className="bg-white p-5 rounded-lg shadow mb-6"
      >
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Application Trends
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={applicationData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="applications"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Recent activity section */}
        <motion.div
          variants={fadeInVariants}
          className="lg:col-span-1 bg-white shadow rounded-lg"
        >
          <div className="px-5 py-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Activity
            </h2>
          </div>
          <div className="p-5">
            <div className="flow-root">
              <ul className="divide-y divide-gray-200">
                <AnimatePresence>
                  {activities.map((activity) => (
                    <motion.li
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="py-4"
                    >
                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 rounded-full p-2 ${getBgColor(
                            activity.color
                          )}`}
                        >
                          <activity.icon className="h-5 w-5" />
                        </div>
                        <div className="ml-4 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.event}
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>{activity.details}</span>
                            <span className="mx-1">•</span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {activity.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
            <div className="mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                View all activity
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Recent jobs section */}
        <motion.div
          variants={fadeInVariants}
          className="lg:col-span-2 bg-white shadow rounded-lg"
        >
          <div className="px-5 py-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Recent Jobs</h2>
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-gray-100 rounded-md px-3 py-1">
                  <Filter className="h-4 w-4 text-gray-500 mr-2" />
                  <div className="flex space-x-1">
                    {["all", "active", "reviewing", "closed"].map((filter) => (
                      <motion.button
                        key={filter}
                        onClick={() => handleFilterChange(filter)}
                        whileHover={{ y: -2 }}
                        whileTap={{ y: 0 }}
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          activeFilter === filter
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View all
                </motion.button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Job Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Company
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Location
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Posted
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Applicants
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredJobs.map((job) => (
                    <motion.tr
                      key={job.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      whileHover={{
                        backgroundColor: "rgba(243, 244, 246, 0.5)",
                      }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                          {job.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {job.company}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {job.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {job.posted}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <motion.span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            job.status
                          )}`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {job.status}
                        </motion.span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {job.applicants}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowJobOptions(
                              showJobOptions === job.id ? null : job.id
                            );
                          }}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>

                        <AnimatePresence>
                          {showJobOptions === job.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.1 }}
                              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="py-1">
                                <button
                                  onClick={() =>
                                    handleJobAction(job.id, "view")
                                  }
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  View Details
                                </button>
                                <button
                                  onClick={() =>
                                    handleJobAction(job.id, "edit")
                                  }
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  Edit Job
                                </button>
                                <button
                                  onClick={() =>
                                    handleJobAction(job.id, "applicants")
                                  }
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  View Applicants
                                </button>
                                <button
                                  onClick={() =>
                                    handleJobAction(job.id, "deactivate")
                                  }
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  Deactivate Job
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          <div className="px-5 py-4 border-t">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Load more jobs
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        variants={itemVariants}
        className="mt-6 text-center text-sm text-gray-500"
      >
        <p>
          © {new Date().getFullYear()} {companyName}. All rights reserved.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
