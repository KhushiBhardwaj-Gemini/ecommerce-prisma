import PropTypes from "prop-types";
import "./style.css";

const Input = ({ name, type = "text", placeholder, formik }) => {
  const error = formik.touched[name] && formik.errors[name];

  return (
    <div className="input-group">
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={error ? "input error" : "input"}
      />

      <p className="error-text">{error ? formik.errors[name] : ""}</p>
    </div>
  );
};

Input.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  formik: PropTypes.object.isRequired,
};

export default Input;
