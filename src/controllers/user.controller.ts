import {
  authenticate,
  TokenService,
  UserService
} from '@loopback/authentication';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/context';
import {repository, Count, CountSchema,Where} from '@loopback/repository';
import {
  get, getModelSchemaRef, HttpErrors,
  param,
  post, requestBody,
  patch,
  del,
  put,
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import _ from 'lodash';
import {
  PasswordHasherBindings, UserServiceBindings
} from '../keys';
import {User} from '../models';
import {Credentials, UserRepository} from '../repositories/user.repository';
import {basicAuthorization} from '../services/authorization';
import {PasswordHasher} from '../services/hash.password.bcryptjs';
import {validateCredentials} from '../services/validator';
import {CredentialsRequestBody, UserProfileSchema} from '../utlis/schema';



export class UserController {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER, {optional: true}) public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtTokenService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE) public userService: UserService<User, Credentials>,
  ) {}

  //tạo user
 @post('/users', {
   responses: {
     '200': {
       description: 'User',
       content: {
         'application/json' : {
           'x-ts-type': User,
         }
       }
     }
   }
 })
 async create(
   @requestBody({
     'application/json' : {
       schema: getModelSchemaRef(User, {
         title: 'New User',
       })
     },
   })
   user: User,
 ): Promise<User> {
    // khởi tạo roles của khách hàng là customer
    user.roles = ['customer'];
    validateCredentials(_.pick(user, ['email', 'password']));

    console.log(user.email + '...user.email');

    const foundUser = await this.userRepository.findOne({
      where: {email: user.email},
    });

    if (foundUser) {
      throw new HttpErrors.UnprocessableEntity(
        `User with email ${user.email} already exists.`,
      );
    }

    // encrypt the password
    // user.password = await hashPassword(user.password, 8);
    user.password = await this.passwordHasher.hashPassword(user.password);

    // create the new user
    const savedUser = await this.userRepository.create(user);

    return savedUser;
 }

 //lấy thông tin user
 @get('/users/{userId}', {
   responses: {
     '200' : {
       description: 'User',
       content: {
         'application/json' : {
            schema: {'x-ts-type': User},
         }
       }
     }
   }
 })
 @authenticate('jwt')
 @authorize({
   allowedRoles: ['admin'],
   voters: [basicAuthorization],
 })
 async findById(
   @param.path.number('userId') userId: number): Promise<User> {
   return this.userRepository.findById(userId, {
     fields: {password: false}
   });
 }

 @get('/users/me', {
  responses: {
    '200': {
      description: 'The current user profile',
      content: {
        'application/json': {
          schema: UserProfileSchema,
        },
      },
    },
  },
})
@authenticate('jwt')
async printCurrentUser(
  @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
): Promise<UserProfile> {
 return currentUserProfile;
}

// đăng nhập
@post('/users/login', {
  responses: {
    '200': {
      description: 'Token',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              token: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
})
async login(
  @requestBody(CredentialsRequestBody) credentials: Credentials,
): Promise<{token: string}> {
  // ensure the user exists, and the password is correct
  const user = await this.userService.verifyCredentials(credentials);

  // convert a User object into a UserProfile object (reduced set of properties)
  const userProfile = this.userService.convertToUserProfile(user);

  // create a JSON Web Token based on the user profile
  const token = await this.jwtTokenService.generateToken(userProfile);

  return {token};
}


// update all user
@patch('/users', {
  responses: {
    '200': {
      description: 'User PATCH success count',
      content: {'application/json': {schema: CountSchema}},
    },
  },
})
async updateAll(
  @requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {partial: true}),
      },
    },
  })
  user: User,
  @param.where(User) where?: Where<User>,
): Promise<Count> {
  return this.userRepository.updateAll(user, where);
}

//update users by id
@patch('/users/{id}', {
  responses: {
    '204': {
      description: 'User PATCH success',
    },
  },
})
async updateById(
  @param.path.number('id') id: number,
  @requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {partial: true}),
      },
    },
  })
  user: User,
): Promise<void> {
  await this.userRepository.updateById(id, user);
}


@put('/users/{id}', {
  responses: {
    '204': {
      description: 'User PUT success',
    },
  },
})
async replaceById(
  @param.path.number('id') id: number,
  @requestBody() user: User,
): Promise<void> {
  await this.userRepository.replaceById(id, user);
}

//delete user 
@del('/users/{id}', {
  responses: {
    '204': {
      description: 'User DELETE success',
    },
  },
})
async deleteById(@param.path.number('id') id: number): Promise<void> {
  await this.userRepository.deleteById(id);
}

}



