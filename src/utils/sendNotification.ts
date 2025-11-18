export async function sendEmail( to: string, subject: string, text: string, html: string ) {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/send-email`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            to: to,
            subject: subject,
            text: text,
            html: html,
        }),
    });

    const data = await res.json();
    console.log(data);
}
