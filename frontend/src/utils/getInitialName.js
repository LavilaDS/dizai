export function getInitialName(user) {
    if (!user) return '';
    const parts = user.trim().split(' ');
    if (parts.length === 1) {
    return parts[0][0].toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}