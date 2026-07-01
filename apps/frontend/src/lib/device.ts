export function getDeviceId() {
  const nav = navigator.userAgent;
  const screenInfo = `${screen.width}x${screen.height}`;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return btoa(`${nav}|${screenInfo}|${timeZone}`);
}