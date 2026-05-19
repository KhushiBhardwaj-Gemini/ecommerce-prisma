import PropTypes from "prop-types";

const FileInput = ({ name, formik }) => {
  return (
    <div className="input-group">
      <input
        type="file"
        name={name}
        className="
            w-full
            rounded-2xl
            border
            border-dashed
            border-slate-300
            bg-slate-50
            px-5
            py-4
            text-slate-600
            transition-all
            duration-300
            hover:border-orange-300
            hover:bg-orange-50/30

            file:mr-4
            file:rounded-xl
            file:border-0
            file:bg-slate-900
            file:px-4
            file:py-2
            file:text-sm
            file:font-medium
            file:text-white
            file:transition
            hover:file:bg-slate-800
        "           
        onChange={(e) => formik.setFieldValue(name, e.currentTarget.files[0])}
      />
    </div>
  );
};

FileInput.propTypes = {
  name: PropTypes.string.isRequired,
  formik: PropTypes.object.isRequired,
};

export default FileInput;
