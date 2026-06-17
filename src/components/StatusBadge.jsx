export const StatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case "Published":
      case "Active":
        return "bg-accent-orange/20 text-accent-orange";
      case "Draft":
      case "Inactive":
        return "bg-gray-700 text-gray-300";
      default:
        return "bg-gray-700 text-gray-300";
    }
  };

  return (
    <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusStyles(status)}`}>
      {status}
    </span>
  );
};
