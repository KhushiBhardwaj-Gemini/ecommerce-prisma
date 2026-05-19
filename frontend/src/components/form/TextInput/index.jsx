import PropTypes from "prop-types";

const Input = ({
  name,
  type = "text",
  placeholder,
  formik,
}) => {
  return (
    <div className="w-full">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="
          w-full
          rounded-2xl
          border
          border-slate-300
          bg-white
          px-4
          py-3
          text-slate-800
          outline-none
          transition-all
          duration-200
          focus:border-amber-500
          focus:ring-4
          focus:ring-amber-100
        "
      />
 
      {formik.touched[name] && formik.errors[name] && (
        <p className="mt-2 text-sm text-red-500">
          {formik.errors[name]}
        </p>
      )}
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
