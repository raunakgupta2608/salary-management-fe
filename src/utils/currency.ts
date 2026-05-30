const currency = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const formatCurrency = (value?: string | number) => {
  const n = Number(value ?? 0);

  if (Number.isNaN(n)) {
    return "—";
  }

  return currency.format(Math.round(n));
};
