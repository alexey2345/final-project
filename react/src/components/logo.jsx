function Logo({ isNightMode, inNavbar }) {
  const textColor = inNavbar
    ? "text-warning" // Always white in the navbar
    : isNightMode
    ? "text-warning" // White in night mode
    : "text-black"; // Black in day mode

  return <span className={`Bold-text ${textColor}`}>EZSell</span>;
}

export default Logo;
