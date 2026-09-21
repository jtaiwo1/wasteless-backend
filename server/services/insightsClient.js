async function getAnalytics(items) {
  const response = await fetch(`${process.env.INSIGHTS_URL}/analytics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(items)
  });
  if (!response.ok) throw new Error("Python analytics service failed");
  return response.json();
}
module.exports = { getAnalytics };
