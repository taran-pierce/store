export default function formatMoney(amount = 0) {
  // so long as we enter curriences in pennies
  // this always looks good
  const options = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  };

  // if the amount is divisible by 100 with no remainders
  // do not show the extra two decimal points
  // cause there is no reason too
  if (amount % 100 === 0) {
    options.minimumFractionDigits = 0;
  }

  // use Intl to format it with our options
  const formatter = Intl.NumberFormat('en-US', options);

  // divide by 100 to move the decimal over
  return formatter.format(amount / 100);
}
