import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { InsertResourceDto } from './resource.controller.js';

@Entity()
export class Resource {
  @PrimaryKey()
  id: number;
  @Property()
  name: string;
  @Property({ type: 'text' })
  description: string;
  @Property()
  price: number;
  @Property()
  createdAt: Date = new Date();
  @Property({ type: 'text' })
  text: string;
  @Property()
  viewCount = 0;

  constructor(dto: InsertResourceDto) {
    this.name = dto.name;
    this.price = dto.price;
    this.text = dto.text;
    this.description = dto.description;
  }
}
