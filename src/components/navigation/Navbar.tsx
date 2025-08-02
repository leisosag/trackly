import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faChartPie,
  faCreditCard,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import PlusDropdown from "@/components/PlusDropdown";

const Navbar = () => {
  return (
    <>
      <nav className="fixed bottom-0 left-0 w-full bg-gray-900 text-white flex justify-around py-2 shadow-lg">
        <NavLink to="/" end className="flex items-center text-sm">
          {({ isActive }) => (
            <>
              <FontAwesomeIcon
                icon={faChartPie}
                className={`text-xl ${
                  isActive ? "text-pink-400" : "text-gray-400"
                }`}
              />
              {/* <span className={isActive ? "text-pink-400" : "text-gray-400"}>
                Home
              </span> */}
            </>
          )}
        </NavLink>

        <NavLink to="/expenses" end className="flex items-center text-sm">
          {({ isActive }) => (
            <>
              <FontAwesomeIcon
                icon={faCreditCard}
                className={`text-xl ${
                  isActive ? "text-pink-400" : "text-gray-400"
                }`}
              />
            </>
          )}
        </NavLink>
        <PlusDropdown />
        <NavLink to="/budgets" end className="flex items-center text-sm">
          {({ isActive }) => (
            <>
              <FontAwesomeIcon
                icon={faList}
                className={`text-xl ${
                  isActive ? "text-pink-400" : "text-gray-400"
                }`}
              />
            </>
          )}
        </NavLink>
        <NavLink to="/settings" end className="flex items-center text-sm">
          {({ isActive }) => (
            <>
              <FontAwesomeIcon
                icon={faGear}
                className={`text-xl ${
                  isActive ? "text-pink-400" : "text-gray-400"
                }`}
              />
            </>
          )}
        </NavLink>
      </nav>
    </>
  );
};

export default Navbar;
