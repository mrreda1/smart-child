import React from "react";

export const SelectField = ({
  label,
  options,
  value,
  onChange,
  name,
  disabled,
}) => (
  <div className="mb-4 text-left">
    <select
      name={name}
      disabled={disabled}
      className={`w-full rounded-full border border-gray-300 bg-transparent px-5 py-3.5 text-sm focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-200 transition-all ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
      value={value}
      onChange={onChange}
    >
      <option value="" disabled>
        {label}
      </option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default SelectField;
