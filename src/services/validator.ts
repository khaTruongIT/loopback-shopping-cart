
import { Credentials } from '../repositories';
import { HttpErrors } from '@loopback/rest';
import isemail from 'isemail';

export function validateCredentials (credentials: Credentials) {
  //Validate Email
  if(!isemail.validate(credentials.email)) {
    throw new HttpErrors.UnprocessableEntity('Gmail nhập không đúng')
  }

  if(credentials.password.length < 8 ) {
    throw new HttpErrors.UnprocessableEntity('Password phải dài hơn hoặc bằng 8 ký tự' )
  }
}
