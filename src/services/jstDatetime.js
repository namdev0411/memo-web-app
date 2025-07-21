// Chuyển đổi giữa UTC ISO string và JST cho input type="datetime-local"

// Convert ISO string (UTC) to JST datetime-local string (yyyy-MM-ddTHH:mm)
export function toJstDatetimeLocalValue(date) {
    if (!date) return '';
    const d = new Date(date);
    // Lấy giờ JST
    const jst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
    return jst.toISOString().slice(0, 16);
}

// Convert datetime-local string (local) về ISO string (UTC)
export function fromJstDatetimeLocalValue(localValue) {
    if (!localValue) return '';
    // localValue: yyyy-MM-ddTHH:mm (local time)
    return new Date(localValue).toISOString();
}

export function convertISOToLocal(isoString) {
    const date = new Date(isoString);

    const formatted = new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).format(date);

    // Đổi định dạng từ dd/mm/yyyy, hh:mm:ss => yyyy-mm-dd hh:mm:ss
    const [day, month, yearAndTime] = formatted.split('/');
    const [year, time] = yearAndTime.split(', ');

    return `${year}-${month}-${day} ${time}`;
}

