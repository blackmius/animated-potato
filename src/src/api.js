const auth = '';
export const q = (s,p=[]) => fetch('/api/q', {
    method: 'POST',
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        'Authorization': `Bearer ${auth}`
    },
    body: JSON.stringify([s,p])
}).then(async (res) => {
    if (res.status !== 200) {
        const err = await res.json();
        throw new Error(err.message)
    }
    return res.json();
});