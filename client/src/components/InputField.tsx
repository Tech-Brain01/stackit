import { motion } from 'framer-motion';
import { useState } from 'react';

interface InputFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

const InputField = ({ value, onChange, placeholder, label, required = false }: InputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {label && (
        <label className="block text-white text-lg font-medium mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-transparent border-2 rounded-lg text-white placeholder-gray-400 outline-none transition-all duration-300 ${
          isFocused ? 'border-blue-500 shadow-lg' : 'border-gray-500'
        }`}
        required={required}
      />
    </motion.div>
  );
};

export default InputField;