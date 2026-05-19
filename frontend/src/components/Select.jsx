const Select = ({ value, onChange, children }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className="
        h-14
        min-w-[190px]
        rounded-2xl
        border
        border-slate-200
        bg-slate-50
        px-4
        text-sm
        text-slate-700
        outline-none
        transition
        focus:border-amber-400
        focus:bg-white
      "
    >
      {children}
    </select>
  );
};

export default Select;