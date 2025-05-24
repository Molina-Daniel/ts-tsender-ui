export function calculateTotal(amounts: string) {
  const amountsArray = amounts
    .split(/[\n,]+/)
    .map((amt) => amt.trim())
    .filter((amt) => amt !== "")
    .map((amt) => parseFloat(amt));
  console.log("amountsArray", amountsArray);

  return amountsArray
    .filter((num) => !Number.isNaN(num))
    .reduce((acc, num) => acc + num, 0);
}
