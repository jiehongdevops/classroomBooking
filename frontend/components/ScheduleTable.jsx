import React from 'react';

const timeSlots = [
  { code: '時段1', label: '09:00~12:00' },
  { code: '時段2', label: '13:00~16:00' },
  { code: '時段3', label: '19:00~21:00' },
  { code: '時段4', label: '21:00~23:00' }
];

const classrooms = [
  { code: 'B01', label: 'B01' },
  { code: 'B02', label: 'B02' },
  { code: 'B03', label: 'B03' },
  { code: 'B04', label: 'B04' },
  { code: 'B05', label: 'B05' },
  { code: 'B06', label: 'B06' },
  { code: 'B07', label: 'B07' },
  { code: 'B08', label: 'B08' },
  { code: 'B09', label: 'B09' },
  { code: '101', label: '101' },
  { code: '102', label: '102' },
  { code: 'conf', label: '會議室' }
];

function ScheduleTable({ bookings }) {
  // 過濾掉狀態為 rejected 的預約（被駁回視同空閒）
  const validBookings = bookings.filter(b => b.status !== 'rejected');

  // 依據每個時段與教室建立表格資料
  const tableData = timeSlots.map(slot => {
    const row = { slot: slot.label };
    classrooms.forEach(room => {
      const booking = validBookings.find(
        b => b.timeSlot === slot.code && b.classroom === room.code
      );
      // 若有預約且狀態為 approved，顯示借用人的帳號；若有預約但狀態不是 approved，顯示該狀態；否則顯示「空閒」
      row[room.code] = booking 
        ? (booking.status === 'approved' ? booking.user : booking.status)
        : '空閒';
    });
    return row;
  });

  return (
    <table border="1">
      <thead>
        <tr>
          <th>時段</th>
          {classrooms.map(room => (
            <th key={room.code}>{room.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, idx) => (
          <tr key={idx}>
            <td>{row.slot}</td>
            {classrooms.map(room => (
              <td key={room.code}>{row[room.code]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ScheduleTable;
