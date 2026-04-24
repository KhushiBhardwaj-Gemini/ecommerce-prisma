export const renderOptions = (options) =>
  options.map(({ label, value }) => (
    <option key={value} value={value}>
      {label}
    </option>
  ));
