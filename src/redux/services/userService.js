export function userLogin(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'test' && password === 'test') {
        const user = {
          token: 'shjdbckjsenlkdw3u79iuoei2jdn'
        }
        localStorage.setItem('user', JSON.stringify(user));

        resolve({data: user});
      } else {
        reject(new Error('Incorrect details'))
      }
    }, 1000);
  })
};

export function userLogout() {
  localStorage.removeItem('user');
};
