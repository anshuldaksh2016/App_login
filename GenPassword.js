const bcrypt = require('bcrypt');

let pswrd = bcrypt.hashSync('12345' , 9);
console.log(pswrd);
// $2b$09$A.kTrHDZsCehcqP98ibe0u2U7t65bXzVCMM8cOUmCybVQfRqyx81y