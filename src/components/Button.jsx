export const Button = ({ children, variant = "primary", size = "md", className = "", ...props }) => {
  const baseStyles = "font-medium rounded-lg transition-colors duration-200 flex items-center gap-2";
  
  const variants = {
    primary: "bg-accent-orange hover:bg-orange-600 text-white",
    secondary: "bg-gray-700 hover:bg-gray-600 text-white",
    ghost: "hover:bg-gray-800 text-gray-300",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
