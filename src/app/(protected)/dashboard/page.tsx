"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { DASHBOARD_STATS, ME } from "@/lib/gql";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "motion/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  Filter,
  RefreshCw,
  Search,
  Users,
  GraduationCap,
  School,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

type RangeKey = "7d" | "30d" | "90d";
type ChartType = "bar" | "area" | "line" | "pie";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

export default function Page() {
  const { data: meData } = useQuery(ME, { fetchPolicy: "cache-first" });
  const [range, setRange] = useState<RangeKey>("30d");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "TEACHER" | "STUDENT">(
    "ALL"
  );
  const [keyword, setKeyword] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, loading, error, refetch } = useQuery(DASHBOARD_STATS, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    skip: !meData?.me,
  });

  // Ensure a fresh fetch after login/navigation
  useEffect(() => {
    if (meData?.me) refetch();
  }, [meData?.me, refetch]);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success("Dashboard data refreshed");
    } catch (err) {
      toast.error("Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const stats = data?.dashboardStats;

  // Demo time-series generated client-side for visual appeal
  const series = useMemo(() => {
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
    const baseUsers = stats?.totalUsers ?? 0;
    const baseTeachers = stats?.totalTeachers ?? 0;
    const baseStudents = stats?.totalStudents ?? 0;

    return Array.from({ length: days }, (_, i) => {
      // More realistic data generation with small variations
      const dayPercent = i / days;
      const trendFactor = Math.sin(dayPercent * Math.PI) * 0.2 + 0.8; // Creates a wave pattern

      return {
        day: `D${i + 1}`,
        Users: Math.max(
          0,
          Math.round(baseUsers * (0.8 + dayPercent * 0.2) + (i % 5) - 2)
        ),
        Teachers: Math.max(
          0,
          Math.round(
            baseTeachers * (0.7 + dayPercent * 0.3 * trendFactor) + (i % 3) - 1
          )
        ),
        Students: Math.max(
          0,
          Math.round(baseStudents * (0.75 + dayPercent * 0.25) + (i % 4) - 1)
        ),
        amt: 2000 + i * 50,
      };
    });
  }, [range, stats]);

  const filteredSeries = useMemo(() => {
    let data = series;
    if (roleFilter !== "ALL") {
      data = data.map((d) => ({
        ...d,
        Users:
          roleFilter === "TEACHER"
            ? d.Teachers
            : roleFilter === "STUDENT"
            ? d.Students
            : d.Users,
        Teachers: roleFilter === "TEACHER" ? d.Teachers : 0,
        Students: roleFilter === "STUDENT" ? d.Students : 0,
      }));
    }
    if (keyword.trim()) {
      data = data.filter((d) =>
        d.day.toLowerCase().includes(keyword.toLowerCase())
      );
    }
    return data;
  }, [series, roleFilter, keyword]);

  // Data for pie chart visualization
  const pieData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: "Students", value: stats.totalStudents, color: "#8884d8" },
      { name: "Teachers", value: stats.totalTeachers, color: "#82ca9d" },
      {
        name: "Other",
        value: stats.totalUsers - stats.totalTeachers - stats.totalStudents,
        color: "#ffc658",
      },
    ].filter((item) => item.value > 0);
  }, [stats]);

  const getPercentage = (value: number, total: number) => {
    if (!total) return "0%";
    return `${Math.round((value / total) * 100)}%`;
  };

  const renderStatCard = (
    title: string,
    value: number | undefined,
    icon: React.ReactNode,
    description: string,
    colorClass: string,
    index: number
  ) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      whileHover={{ translateY: -5 }}
      className="group"
    >
      <Card
        className={`shadow-lg overflow-hidden border border-border/50 ${colorClass} h-full`}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
            <div className="rounded-full p-2 bg-primary/10 text-primary">
              {icon}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-1">
            {loading ? (
              <Skeleton className="h-9 w-16" />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${value}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-3xl font-bold"
                >
                  {value ?? 0}
                </motion.div>
              </AnimatePresence>
            )}
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Badge
            variant="outline"
            className="transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
          >
            {stats?.totalUsers
              ? getPercentage(value ?? 0, stats.totalUsers)
              : "0%"}{" "}
            of total
          </Badge>
        </CardFooter>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-purple-50 via-white to-cyan-50 dark:from-[#06050a] dark:via-black dark:to-[#070a0e]">
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <motion.h1
            className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            Analytics Dashboard
          </motion.h1>
          <motion.p
            className="text-muted-foreground mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Welcome{meData?.me ? `, ${meData.me.name}` : ""} to your
            personalized dashboard
          </motion.p>
        </div>
        <motion.div
          className="flex gap-2 items-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isRefreshing || loading}
          >
            <RefreshCw
              size={16}
              className={`mr-1 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon size={16} className="mr-1" />
                {date ? format(date, "PP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid gap-4 grid-cols-1 md:grid-cols-4 mb-6 items-start"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
      >
        <Card className="md:col-span-3 border border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">Filters</CardTitle>
              <Filter size={16} />
            </div>
            <CardDescription>Refine the dashboard data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Time Range
                </label>
                <Select
                  value={range}
                  onValueChange={(v) => setRange(v as RangeKey)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  User Role
                </label>
                <Select
                  value={roleFilter}
                  onValueChange={(v) => setRoleFilter(v as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Role filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Roles</SelectItem>
                    <SelectItem value="TEACHER">Teacher Only</SelectItem>
                    <SelectItem value="STUDENT">Student Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-8"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Search days (e.g., D10)"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full border border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Chart Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Button
                variant={chartType === "bar" ? "default" : "outline"}
                size="sm"
                className="justify-start"
                onClick={() => setChartType("bar")}
              >
                Bar Chart
              </Button>
              <Button
                variant={chartType === "area" ? "default" : "outline"}
                size="sm"
                className="justify-start"
                onClick={() => setChartType("area")}
              >
                Area Chart
              </Button>
              <Button
                variant={chartType === "line" ? "default" : "outline"}
                size="sm"
                className="justify-start"
                onClick={() => setChartType("line")}
              >
                Line Chart
              </Button>
              <Button
                variant={chartType === "pie" ? "default" : "outline"}
                size="sm"
                className="justify-start"
                onClick={() => setChartType("pie")}
              >
                Pie Chart
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {renderStatCard(
          "Total Users",
          stats?.totalUsers,
          <Users size={20} />,
          "Active users on the platform",
          "bg-gradient-to-br from-white to-fuchsia-50 dark:from-neutral-900 dark:to-neutral-800",
          1
        )}
        {renderStatCard(
          "Teachers",
          stats?.totalTeachers,
          <GraduationCap size={20} />,
          "Registered teaching staff",
          "bg-gradient-to-br from-white to-cyan-50 dark:from-neutral-900 dark:to-neutral-800",
          2
        )}
        {renderStatCard(
          "Students",
          stats?.totalStudents,
          <School size={20} />,
          "Enrolled students",
          "bg-gradient-to-br from-white to-violet-50 dark:from-neutral-900 dark:to-neutral-800",
          3
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <Card className="shadow-xl border border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Population Trends</CardTitle>
              <Tabs
                defaultValue={chartType}
                onValueChange={(v) => setChartType(v as ChartType)}
                className="hidden sm:block"
              >
                <TabsList>
                  <TabsTrigger value="bar">Bar</TabsTrigger>
                  <TabsTrigger value="area">Area</TabsTrigger>
                  <TabsTrigger value="line">Line</TabsTrigger>
                  <TabsTrigger value="pie">Pie</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <CardDescription>
              User growth over{" "}
              {range === "7d"
                ? "the last week"
                : range === "30d"
                ? "the last month"
                : "the last quarter"}
              {roleFilter !== "ALL" && ` (${roleFilter.toLowerCase()} focus)`}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={chartType}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                      <p className="text-muted-foreground">
                        Loading chart data...
                      </p>
                    </div>
                  </div>
                ) : chartType === "pie" ? (
                  <div className="h-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          animationDuration={500}
                          animationEasing="ease-out"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : chartType === "area" ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={filteredSeries}>
                      <defs>
                        <linearGradient
                          id="colorUsers"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#8884d8"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8884d8"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorTeachers"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#82ca9d"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#82ca9d"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorStudents"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#ffc658"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#ffc658"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        strokeOpacity={0.3}
                      />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {roleFilter === "ALL" || roleFilter === "STUDENT" ? (
                        <Area
                          type="monotone"
                          dataKey="Students"
                          stroke="#ffc658"
                          fillOpacity={1}
                          fill="url(#colorStudents)"
                        />
                      ) : null}
                      {roleFilter === "ALL" || roleFilter === "TEACHER" ? (
                        <Area
                          type="monotone"
                          dataKey="Teachers"
                          stroke="#82ca9d"
                          fillOpacity={1}
                          fill="url(#colorTeachers)"
                        />
                      ) : null}
                      {roleFilter === "ALL" ? (
                        <Area
                          type="monotone"
                          dataKey="Users"
                          stroke="#8884d8"
                          fillOpacity={1}
                          fill="url(#colorUsers)"
                        />
                      ) : null}
                    </AreaChart>
                  </ResponsiveContainer>
                ) : chartType === "line" ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredSeries}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        strokeOpacity={0.3}
                      />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {roleFilter === "ALL" || roleFilter === "STUDENT" ? (
                        <Line
                          type="monotone"
                          dataKey="Students"
                          stroke="#ffc658"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                          dot={{ stroke: "#ffc658", strokeWidth: 2, r: 4 }}
                          animationDuration={1500}
                        />
                      ) : null}
                      {roleFilter === "ALL" || roleFilter === "TEACHER" ? (
                        <Line
                          type="monotone"
                          dataKey="Teachers"
                          stroke="#82ca9d"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                          dot={{ stroke: "#82ca9d", strokeWidth: 2, r: 4 }}
                          animationDuration={1500}
                          animationBegin={300}
                        />
                      ) : null}
                      {roleFilter === "ALL" ? (
                        <Line
                          type="monotone"
                          dataKey="Users"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                          dot={{ stroke: "#8884d8", strokeWidth: 2, r: 4 }}
                          animationDuration={1500}
                          animationBegin={600}
                        />
                      ) : null}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredSeries}>
                      <defs>
                        <linearGradient
                          id="usersGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#8884d8"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="100%"
                            stopColor="#8884d8"
                            stopOpacity={0.4}
                          />
                        </linearGradient>
                        <linearGradient
                          id="teachersGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#82ca9d"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="100%"
                            stopColor="#82ca9d"
                            stopOpacity={0.4}
                          />
                        </linearGradient>
                        <linearGradient
                          id="studentsGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#ffc658"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="100%"
                            stopColor="#ffc658"
                            stopOpacity={0.4}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        strokeOpacity={0.3}
                      />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {roleFilter === "ALL" && (
                        <Bar
                          dataKey="Users"
                          fill="url(#usersGrad)"
                          animationDuration={1500}
                        />
                      )}
                      {(roleFilter === "ALL" || roleFilter === "TEACHER") && (
                        <Bar
                          dataKey="Teachers"
                          fill="url(#teachersGrad)"
                          animationDuration={1500}
                          animationBegin={300}
                        />
                      )}
                      {(roleFilter === "ALL" || roleFilter === "STUDENT") && (
                        <Bar
                          dataKey="Students"
                          fill="url(#studentsGrad)"
                          animationDuration={1500}
                          animationBegin={600}
                        />
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-destructive/15 border border-destructive/30 text-destructive rounded-md p-3 mt-4"
        >
          <p className="text-sm font-medium">{error.message}</p>
        </motion.div>
      )}
    </div>
  );
}
