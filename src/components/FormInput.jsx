export default function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  options,
  icon,
  required = false,
  className = "",
}) {
  const baseClasses = `w-full bg-white border-2 border-gray-100 rounded-[1.5rem] px-5 py-4 text-gray-800 text-base font-bold focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-400 transition-all placeholder:text-gray-300 placeholder:font-normal shadow-sm group-hover:border-gray-200 ${className}`;

  return (
    <div className="space-y-3 group">
      {label && (
        <label className="block text-sm font-black text-gray-500 mr-2 uppercase tracking-wide">
          {label}
          {required && <span className="text-rose-500 mr-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl z-10 pointer-events-none opacity-50">
            {icon}
          </span>
        )}

        {type === 'select' ? (
          <select
            value={value}
            onChange={onChange}
            className={`${baseClasses} ${icon ? 'pr-12' : ''} appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23D1D5DB%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[position:left_1.25rem_center] bg-no-repeat`}
            required={required}
          >
            <option value="" disabled>{placeholder || 'اختار...'}</option>
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value} className="font-bold py-2">
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            onKeyDown={(e) => {
              if (type === 'number' && ['e', 'E', '+', '-'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            placeholder={placeholder}
            className={`${baseClasses} ${icon ? 'pr-12' : ''}`}
            required={required}
            min={type === 'number' ? '0' : undefined}
            step={type === 'number' ? 'any' : undefined}
          />
        )}
      </div>
    </div>
  );
}
