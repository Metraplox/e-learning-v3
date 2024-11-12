import { Resolver, Query } from '@nestjs/graphql';
import { User } from './users/models/user.model';

@Resolver()
export class GraphQLResolver {
    @Query(() => String, { name: 'healthCheck' })
    async healthCheck() {
        return 'OK';
    }

    @Query(() => [User], { name: 'users', nullable: true })
    async getUsers() {
        return []; // Implementar lógica real después
    }
}