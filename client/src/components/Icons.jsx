import React from "react";

const Icons = ({ name, width, height, color }) => {
  const getIcon = (name) => {
    if (name === "Dashboard") {
      return (
        <svg
          width={width}
          height={height}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.5 19.9V4.1C10.5 2.6 9.86 2 8.27 2H4.23C2.64 2 2 2.6 2 4.1V19.9C2 21.4 2.64 22 4.23 22H8.27C9.86 22 10.5 21.4 10.5 19.9Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 8.52V3.98C22 2.57 21.36 2 19.77 2H15.73C14.14 2 13.5 2.57 13.5 3.98V8.51C13.5 9.93 14.14 10.49 15.73 10.49H19.77C21.36 10.5 22 9.93 22 8.52Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 19.77V15.73C22 14.14 21.36 13.5 19.77 13.5H15.73C14.14 13.5 13.5 14.14 13.5 15.73V19.77C13.5 21.36 14.14 22 15.73 22H19.77C21.36 22 22 21.36 22 19.77Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
    if (name === "Location") {
      return (
        <svg
          width={width}
          height={height}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.22915 5.66667L18.4297 20.5065M3.22915 5.66667C3.7947 5.021 4.63942 4.61111 5.58316 4.61111H10.7218M3.22915 5.66667C2.77429 6.18596 2.5 6.85777 2.5 7.5915V18.5196C2.5 20.1656 3.88038 21.5 5.58316 21.5H16.8881C18.5909 21.5 19.9713 20.1656 19.9713 18.5196V14.049M10.7218 14.049L4.04158 20.5065M18.0057 5.87778V5.81428M21.5 5.80435C21.5 8.00725 18.0057 10.9444 18.0057 10.9444C18.0057 10.9444 14.5115 8.00725 14.5115 5.80435C14.5115 3.97941 16.0759 2.5 18.0057 2.5C19.9356 2.5 21.5 3.97941 21.5 5.80435Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      );
    }
    if (name === "Pollution Report") {
      return (
        <svg
          width={width}
          height={height}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 11.6661H8L10.0404 5L14.4382 19L15.9903 11.6661H20"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      );
    }
    if (name === "Account") {
      return (
        <svg
          width={width}
          height={height}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.1999 19.8003C4.54426 19.4146 6.85775 17.5977 8.00766 16.702C8.42646 16.3757 8.94017 16.2003 9.47104 16.2003C10.7547 16.2003 13.2283 16.2003 14.5181 16.2003C15.0552 16.2003 15.574 16.3832 16.0065 16.7017C17.4912 17.7956 18.8832 18.6106 20.3999 19.8003M5.9999 21.6H17.9999C19.9881 21.6 21.5999 19.9882 21.5999 18V6.00002C21.5999 4.0118 19.9881 2.40002 17.9999 2.40002H5.9999C4.01168 2.40002 2.3999 4.0118 2.3999 6.00002V18C2.3999 19.9882 4.01168 21.6 5.9999 21.6ZM15.4385 9.27206C15.4385 7.44055 13.8923 5.94411 11.9999 5.94411C10.1075 5.94411 8.56135 7.44055 8.56135 9.27206C8.56135 11.1036 10.1075 12.6 11.9999 12.6C13.8923 12.6 15.4385 11.1036 15.4385 9.27206Z"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
      );
    }
    if (name === "logout") {
      return (
        <svg
          width={width}
          height={height}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.6471 7.8001V5.7001C14.6471 5.14314 14.424 4.609 14.0268 4.21517C13.6297 3.82135 13.091 3.6001 12.5294 3.6001H5.11765C4.55601 3.6001 4.01738 3.82135 3.62024 4.21517C3.22311 4.609 3 5.14314 3 5.7001V18.3001C3 18.8571 3.22311 19.3912 3.62024 19.785C4.01738 20.1788 4.55601 20.4001 5.11765 20.4001H12.5294C13.091 20.4001 13.6297 20.1788 14.0268 19.785C14.424 19.3912 14.6471 18.8571 14.6471 18.3001V16.2001M8.29412 12.0001H21M21 12.0001L17.8235 8.8501M21 12.0001L17.8235 15.1501"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      );
    }
  };
  return (
    <div
      style={{
        color: color,
      }}
    >
      {getIcon(name)}
    </div>
  );
};

export default Icons;
