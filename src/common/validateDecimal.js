export const regexDecial = /^[0-9]{1,50}([,.]?[0-9]{1,50})?$/

export const validateDecimal = (val) => {
  if (val)
    return val.match(regexDecial);
}

export const parseDecimal = (val) => {
  if (val)
    return Number(val.replace(",", "."))
}