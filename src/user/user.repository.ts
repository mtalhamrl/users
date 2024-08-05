import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly neo4jService: Neo4jService) {}
  async create(createUserDto: CreateUserDto) {
    const referenceId = createUserDto.details.userId;
    const representation = createUserDto.representation;
    const { username, firstName, lastName, email } = JSON.parse(representation);
    const session = this.neo4jService.getWriteSession();
    const transaction = session.beginTransaction();
    try {
      const query = `
      CREATE (u:User {
        referenceId: $referenceId,
        username: $username,
        firstName: $firstName,
        lastName: $lastName,
        email: $email
      }) RETURN u
    `;
      const params = { referenceId, username, firstName, lastName, email };

      const result = await transaction.run(query, params);
      const user = result.records[0].get('u').properties;
      await transaction.commit();
      return user;
    } catch (error) {
      await transaction.rollback();
      throw error;
    } finally {
      await session.close();
    }
  }
  async findAll() {
    const query = `match (user:User) return user`;
    const result = await this.neo4jService.read(query);
    return result.records.map((record) => record.get('user').properties);
  }
  async update(updateUserDto: UpdateUserDto) {
    console.log('Received updateUserDto:', updateUserDto);

    // Parse the representation string
    let representation;
    try {
      representation = JSON.parse(updateUserDto.representation);
    } catch (error) {
      console.error('Failed to parse representation:', error);
      return;
    }

    // Extract the referenceId (userId)
    const referenceId = updateUserDto.details?.userId;
    if (!referenceId) {
      console.log('Invalid referenceId.');
      return;
    }

    // Collect updated properties
    const updateProps: Record<string, any> = {};
    if (representation.firstName !== undefined)
      updateProps.firstName = representation.firstName;
    if (representation.lastName !== undefined)
      updateProps.lastName = representation.lastName;
    if (representation.email !== undefined)
      updateProps.email = representation.email;
    if (representation.username !== undefined)
      updateProps.username = representation.username;

    console.log('updateProps:', updateProps);

    // If there are no valid properties to update, end the operation
    if (Object.keys(updateProps).length === 0) {
      console.log('No valid properties to update.');
      return;
    }

    // Create SET statement
    const setString = Object.keys(updateProps)
      .map((key) => `n.${key} = $${key}`)
      .join(', ');

    const cypherQuery = `
        MATCH (n:User) WHERE n.referenceId = $referenceId
        SET ${setString}
        RETURN n
    `;

    console.log('Executing query:', cypherQuery);
    console.log('With parameters:', { referenceId, ...updateProps });

    await this.neo4jService.write(cypherQuery, {
      referenceId,
      ...updateProps,
    });
  }

  async delete(deleteUserDto: DeleteUserDto) {
    const referenceId = deleteUserDto.details.userId;
    const session = this.neo4jService.getWriteSession();
    const transaction = session.beginTransaction();
    const query = `
      MATCH (u:User) where u.referenceId = $referenceId
      DELETE u
    `;
    const params = { referenceId };

    try {
      await transaction.run(query, params);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    } finally {
      await session.close();
    }
  }
}
