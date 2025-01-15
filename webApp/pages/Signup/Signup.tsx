import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div>
      <form>
        <input type="text" placeholder="FullName" />
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
