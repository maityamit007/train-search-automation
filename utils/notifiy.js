async function notify(message, train) {
    console.log(message);
const notifyKeywords = [
    // 'AVAILABLE',
    'RAC',
    'WL',
    'WAITLIST',
    'REGRET',
    'NOT AVAILABLE'
];
console.log('train', train);
const shouldNotify = train.matches.some(match =>
    notifyKeywords.some(keyword =>
        match.availability.toUpperCase().includes(keyword)
    )
);

if (!shouldNotify) {
    console.log('🔔 Notification:', message);
}}

module.exports = { notify };