import PropTypes from "prop-types";
import "../TextInput/style.css";

const SelectInput = ({
  name,
  formik,
  options,
  placeholder,
}) => {
  const error = formik.touched[name] && formik.errors[name];

  return (
    <div className="input-group">
      <select
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={error ? "input error" : "input"}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      <p className="error-text">
        {error ? formik.errors[name] : ""}
      </p>
    </div>
  );
};

SelectInput.propTypes = {
  name: PropTypes.string.isRequired,
  formik: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
};

export default SelectInput;