import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('DateTime', () => Date)
export class DateScalar implements CustomScalar<string, Date> {
    description = 'Date custom scalar type';

    parseValue(value: string): Date {
        return new Date(value);
    }

    serialize(value: Date | string): string {
        if (value instanceof Date) {
            return value.toISOString();
        }
        return new Date(value).toISOString();
    }

    parseLiteral(ast: ValueNode): Date {
        if (ast.kind === Kind.STRING || ast.kind === Kind.INT) {
            return new Date(ast.value);
        }
        return null;
    }
}