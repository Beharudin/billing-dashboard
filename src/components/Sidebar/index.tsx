import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../common/Logo";
import { NavigationItem } from "../../constants/interface/NavigationItem";
import { cn, getParentMenuPathname, isActivePath } from "../../lib/utils";
import { useAppSelector } from "../../store";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  menuItems: NavigationItem[];
  rootPath: string;
}

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  menuItems,
  rootPath,
}: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

  const { user } = useAppSelector((state) => state.auth);
  const allowedMenu = menuItems;
  // const allowedMenu = menuItems
  //   .filter((item) => !item.roles || item.roles.includes(user?.userType ?? ""))
  //   .map((item) => {
  //     // Filter submenu items based on user role
  //     if (item.subMenu) {
  //       return {
  //         ...item,
  //         subMenu: item.subMenu.filter(
  //           (subItem) =>
  //             !subItem.roles || subItem.roles.includes(user?.userType ?? "")
  //         ),
  //       };
  //     }
  //     return item;
  //   })
  //   .filter((item) => {
  //     // Remove parent menu items that have no accessible submenu items
  //     if (item.subMenu && item.subMenu.length === 0) {
  //       return false;
  //     }
  //     return true;
  //   });

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // State to track which submenu is open
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(() => {
    // Initialize with active submenu on mount to prevent flicker
    const activeMenuItem = allowedMenu.find((item) => {
      if (item.subMenu) {
        return item.subMenu.some((subItem) =>
          isActivePath(pathname, rootPath, subItem.pathname)
        );
      }
      return false;
    });
    return activeMenuItem ? activeMenuItem.label : null;
  });

  // Toggle submenu visibility
  const toggleSubMenu = (label: string) => {
    const menuItem = allowedMenu.find((item) => item.label === label);

    if (menuItem?.subMenu && menuItem.subMenu.length > 0) {
      // If submenu is not open, open it
      if (openSubMenu !== label) {
        setOpenSubMenu(label);
        // Use utility function to determine the appropriate pathname based on user permissions
        const targetPathname = getParentMenuPathname(
          menuItem.subMenu,
          user?.userType,
          menuItem.pathname || menuItem.to
        );
        navigate(targetPathname);
      } else {
        // If submenu is already open, just close it
        setOpenSubMenu(null);
      }
    } else {
      // For items without submenu, just toggle
      setOpenSubMenu(openSubMenu === label ? null : label);
    }
  };

  // Auto-open submenu if it has an active child (only when pathname changes)
  useEffect(() => {
    const activeMenuItem = allowedMenu.find((item) => {
      if (item.subMenu) {
        return item.subMenu.some((subItem) =>
          isActivePath(pathname, rootPath, subItem.pathname)
        );
      }
      return false;
    });

    if (activeMenuItem && openSubMenu !== activeMenuItem.label) {
      setOpenSubMenu(activeMenuItem.label);
    }
  }, [pathname, allowedMenu, rootPath, openSubMenu]);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[40] bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        ref={sidebar}
        className={cn(
          "absolute left-0 top-0 z-[50] flex h-screen w-72 flex-col overflow-y-hidden",
          "bg-[#0099d4] dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-900",
          "shadow-xl border-r border-blue-300/30 dark:border-slate-700/50",
          "backdrop-blur-sm",
          "duration-300 ease-in-out lg:static lg:translate-x-0",
          sidebarOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0 lg:opacity-100"
        )}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="relative flex items-center justify-between gap-2 px-6 py-6 border-b border-white/10 dark:border-slate-700/50">
          <Logo />

          <button
            ref={trigger}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            className="block lg:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="flex-1 py-6 px-4 lg:px-6">
            {/* <!-- Menu Group --> */}
            <div>
              <h3 className="mb-6 ml-4 text-xs font-semibold text-white/60 uppercase tracking-wider">
                Navigation
              </h3>

              <ul className="mb-6 flex flex-col gap-1.5">
                {allowedMenu.map((item) => {
                  const isActive = item.subMenu
                    ? item.subMenu.some((subItem) =>
                        isActivePath(pathname, rootPath, subItem.pathname)
                      )
                    : isActivePath(pathname, rootPath, item.pathname);
                  return (
                    <li key={item.to}>
                      <SidebarItem
                        label={item.label}
                        to={item.to}
                        icon={item.icon}
                        isActive={isActive}
                        subMenu={item.subMenu}
                        isOpen={openSubMenu === item.label}
                        toggleSubMenu={() => toggleSubMenu(item.label)}
                        pathname={pathname}
                        rootPath={rootPath}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

const SidebarItem = ({
  to,
  icon,
  label,
  isActive,
  subMenu,
  isOpen,
  toggleSubMenu,
  pathname,
  rootPath,
}: {
  to: string;
  icon?: JSX.Element;
  label: string;
  isActive: boolean;
  subMenu?: NavigationItem[];
  isOpen: boolean;
  toggleSubMenu: () => void;
  pathname: string;
  rootPath: string;
}) => {
  const baseClasses = cn(
    "group relative flex items-center gap-3 py-3 px-4 font-medium w-full text-left",
    "sidebar-item-hover",
    subMenu ? "" : "hover:bg-white/10 hover:shadow-sm focus:bg-white/10",
    "focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none",
    "border-0 ring-0 shadow-none outline-none",
    isActive
      ? "text-white border-0 ring-0 outline-none"
      : "text-white/80 hover:text-white"
  );

  const navContent = (
    <>
      {isActive && !subMenu && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white" />
      )}
      {/* Icon */}
      <div className="flex-shrink-0 transition-colors duration-200 text-white/70 group-hover:text-white">
        {icon}
      </div>

      {/* Label */}
      <span className="flex-1 truncate">{label}</span>

      {/* Submenu chevron */}
      {subMenu && (
        <div
          className={cn(
            "flex-shrink-0 transition-all duration-200 text-white/60 group-hover:text-white/80",
            isOpen ? "rotate-0" : "-rotate-90"
          )}
        >
          <ChevronDown size={16} />
        </div>
      )}
    </>
  );

  return (
    <div className="relative">
      {subMenu ? (
        <button type="button" onClick={toggleSubMenu} className={baseClasses}>
          {navContent}
        </button>
      ) : (
        <NavLink to={to} className={baseClasses}>
          {navContent}
        </NavLink>
      )}

      {/* Submenu */}
      {subMenu && (
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
          )}
        >
          <ul className="ml-4 flex flex-col gap-1 pl-4">
            {subMenu.map((subItem) => {
              const isSubItemActive = isActivePath(
                pathname,
                rootPath,
                subItem.pathname
              );
              return (
                <li key={subItem.to}>
                  <NavLink
                    to={subItem.to}
                    className={cn(
                      "group/sub flex items-center gap-3 py-2.5 px-3",
                      "sidebar-item-hover relative",
                      "focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none",
                      "border-0 ring-0 shadow-none",
                      isSubItemActive
                        ? "text-white font-semibold bg-white/10"
                        : "text-white/70 hover:text-white/90 hover:bg-white/5"
                    )}
                  >
                    {/* Active indicator badge on the left */}
                    {isSubItemActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white" />
                    )}

                    {/* Submenu label */}
                    <span className="flex-1 truncate">{subItem.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
