import cryptos from "crypto" ;


export const hashPassword = password => {
  return cryptos.createHash('sha256').update(password).digest('hex')
}

export const compareHashPassword = (password, hashedPassword) => {
  if (hashPassword(password) === hashedPassword) {
      return { success: true, message: 'Password matched' }
  }
  return { success: false, message: 'Password not matched' }
}

export const responseSuccess = (msg, data = null) => {
  return {
    status: "success",
    message: msg,
    data: data,
  };
};

export const responseError = (msg, errors = null) => {
  return {
    status: "error",
    message: msg,
    errors: errors
  };
};
