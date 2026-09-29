async function getAnalytics(user_id) {
  const response = await fetch(`${process.env.INSIGHTS_URL}/analytics/${user_id}`);
  if (!response.ok) throw new Error("Python analytics service failed");
  return response.json();
}
module.exports = { getAnalytics };
