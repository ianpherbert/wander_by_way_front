export const formatTime = (totalMinutes: number) =>{
    const hours = Math.floor(totalMinutes / 60);
    const minutes = (totalMinutes % 60);
    const minuteString = minutes === 0 ? "00" : minutes < 10 ? "0"+minutes : minutes.toString()
    return `${hours}:${minuteString}`;
}
