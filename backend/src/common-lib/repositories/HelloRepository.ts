// Lien avec la BDD
import { HelloEntity } from '../entity/HelloEntity.js';

export class HelloRepository {
  getHello(): HelloEntity {
    return new HelloEntity('Salut du backend test test 1');
  }
}