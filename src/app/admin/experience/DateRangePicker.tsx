// 'use client';

// import React, { useState, useEffect } from 'react';
// import { DateRangePicker, ValueType } from 'rsuite';
// import 'rsuite/dist/rsuite.min.css';

// interface Props {
//   initialDateString?: string;
//   onDateChange: (dateString: string) => void;
// }

// const CustomDateRangePicker = ({ initialDateString, onDateChange }: Props) => {
//   const [dateRange, setDateRange] = useState<ValueType>(null);

//   useEffect(() => {
//     if (initialDateString && initialDateString.includes(' - ')) {
//       const [startStr, endStr] = initialDateString.split(' - ');
//       setDateRange([new Date(startStr), endStr === 'Present' ? null : new Date(endStr)]);
//     }
//   }, [initialDateString]);

//   useEffect(() => {
//     if (dateRange && Array.isArray(dateRange) && dateRange[0]) {
//       let dateString = dateRange[0].toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
//       if (dateRange[1]) {
//         dateString += ' - ' + dateRange[1].toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
//       } else {
//         dateString += ' - Present';
//       }
//       onDateChange(dateString);
//     }
//   }, [dateRange, onDateChange]);

//   return (
//     <DateRangePicker
//       value={dateRange}
//       onChange={setDateRange}
//       format="MMM yyyy"
//       placement="autoVerticalStart"
//       placeholder="Select date range..."
//       showOneCalendar
//     />
//   );
// };

// export default CustomDateRangePicker;