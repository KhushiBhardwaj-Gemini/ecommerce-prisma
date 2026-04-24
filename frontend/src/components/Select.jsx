const Select = ({ value, onChange, children, darkMode }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={darkMode ? "select dark" : "select"}
    >
      {children}
    </select>
  );
};

export default Select;
