import PropTypes from "prop-types";
import "../TextInput/style.css";

const FileInput = ({ name, formik }) => {
  return (
    <div className="input-group">
      <input
        type="file"
        name={name}
        className="input"
        onChange={(e) =>
          formik.setFieldValue(
            name,
            e.currentTarget.files[0]
          )
        }
      />
    </div>
  );
};

FileInput.propTypes = {
  name: PropTypes.string.isRequired,
  formik: PropTypes.object.isRequired,
};

export default FileInput;