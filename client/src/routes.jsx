import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, JoinTeam, Salary, CreateCompany } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import AttendanceTracker from "./pages/dashboard/attendanceTracker";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Join a Team",
        path: "/join-team",
        element: <JoinTeam />,
      },
      {
        icon: <BellIcon {...icon} />,
        name: "salary management",
        path: "/salary-management",
        element: <Salary />,
      },
      {
        icon: <PlusIcon {...icon} />,
        name: "create company",
        path: "/create-company",
        element: <CreateCompany />,
      },
      {
        icon: <PlusIcon {...icon} />,
        name: "Track Attendance",
        path: "/attendance-tracker",
        element: <AttendanceTracker />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ArrowRightOnRectangleIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <UserPlusIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
