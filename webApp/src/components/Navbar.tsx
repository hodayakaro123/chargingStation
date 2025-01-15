import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="">Add my own charging station</NavLink>
        </li>
        <li>
          <NavLink to="">Trip planning</NavLink>
        </li>
        <li>
          <NavLink to="">Activity history</NavLink>
        </li>
        <li>
          <NavLink to="">Personal area</NavLink>
        </li>
      </ul>
    </nav>
  );
}
