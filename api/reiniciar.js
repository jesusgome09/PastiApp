export default async function handler(req, res) {
  const response = await fetch('https://api.onesignal.com/apps/496d72f4-01e1-4e0e-b0da-a2df55463b67/users', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Key TU_REST_API_KEY_DE_ONESIGNAL' 
    },
    body: JSON.stringify({
      tags: { estado_hoy: "pendiente" }
    })
  });
  res.status(200).json({ status: "ok" });
}