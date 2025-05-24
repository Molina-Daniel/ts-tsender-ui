export function formatWei(wei: number, decimals: number) {
  const weiBigInt = BigInt(wei);
  const divisor = BigInt(10) ** BigInt(decimals);
  const weiDecimal = Number(weiBigInt) / Number(divisor);
  return weiDecimal.toFixed(4);
}
