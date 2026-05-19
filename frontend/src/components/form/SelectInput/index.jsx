import PropTypes from "prop-types";

const SelectInput = ({ name, formik, options, placeholder }) => {
  const error = formik.touched[name] && formik.errors[name];

  return (
    <div className="input-group">
      <select
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`
            w-full
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            px-5
            py-4
            text-slate-800
            outline-none
            transition-all
            duration-300
            focus:border-orange-400
            focus:bg-white
            focus:ring-4
            focus:ring-orange-100
            ${error ? "border-red-400" : ""}
        `}          
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <p className="mt-2 text-sm text-red-500">{error ? formik.errors[name] : ""}</p>
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
