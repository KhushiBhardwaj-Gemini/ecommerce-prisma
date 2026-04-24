const Input = ({ value, onChange, placeholder, darkMode, type = "text" }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={darkMode ? "input dark" : "input"}
    />
  );
};

export default Input;
