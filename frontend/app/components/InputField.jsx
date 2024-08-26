import React from "react";

const InputField = ({ label, type = "text", value, onChange, error, placeholder }) => {
  return (
    <div className="w-full">
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="bg-black/50 placeholder:text-white h-[40px] w-full p-4 rounded-[10px] focus:border-2 focus:border-red-600 outline-none"
        placeholder={placeholder}
      />
      {error && (
        <p className="text-red-400 bg-black mt-2 rounded-[10px] p-2">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
