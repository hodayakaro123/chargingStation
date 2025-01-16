import { Link } from "react-router-dom";
import "./signup.css";
export default function Signup() {
  return (
    <div>
      <form>
        <h1>Sign-up</h1>
        <input type="text" placeholder="First Name" />
        <input type="text" placeholder="Last Name" />
        <input type="text" placeholder="Email Address" />
        <input type="text" placeholder="Password" />
        <input type="text" placeholder="Confirm Password" />
        <input type="text" placeholder="Phone Number" />

        <button>Signup</button>
        <Link to="/">already have an account?</Link>
      </form>
    </div>
  );
}
