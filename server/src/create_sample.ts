import xlsx from 'xlsx';

const data = [
    { Name: 'John Doe', Place: 'New York', Stream: 'Science', DOB: '2005-05-15', Math: 90, Science: 85, History: 88, Total: 263 },
    { Name: 'Jane Smith', Place: 'London', Stream: 'Commerce', DOB: '2006-08-20', Math: 95, Science: 92, History: 90, Total: 277 },
    { Name: 'Alice Johnson', Place: 'Paris', Stream: 'Humanities', DOB: '2005-11-10', Math: 80, Science: 88, History: 85, Total: 253 },
    { Name: 'Bob Brown', Place: 'Berlin', Stream: 'Science', DOB: '2005-02-25', Math: 70, Science: 75, History: 72, Total: 217 },
];

const workbook = xlsx.utils.book_new();
const worksheet = xlsx.utils.json_to_sheet(data);
xlsx.utils.book_append_sheet(workbook, worksheet, 'Marks');

xlsx.writeFile(workbook, 'marks.xlsx');
console.log('mark.xlsx created successfully');
