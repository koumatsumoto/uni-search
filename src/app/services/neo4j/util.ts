import * as neo4j from 'neo4j-driver';

type AppNode<T extends object = {}> = {
  id: number;
  label: string;
} & T;

type AppRelationship<T extends object = {}> = {
  id: number;
  relationship: string;
  source: number;
  target: number;
} & T;

export const returnFirstOrNull = (records: neo4j.Record[]) => {
  if (records.length < 1) {
    return null;
  }

  const values = Array.from(records.values());
  const value = values[0];

  return value.get(value.keys[0]);
};

// TODO: @types/neo4j-driver is incorrect
// tslint:disable-next-line
const isInt = (value: any): value is neo4j.Integer => neo4j.isInt(value);
// tslint:disable-next-line
const toIntIfNeeded = (value: any) => (isInt(value) ? value.toInt() : value);

const makeJSObject = (obj: Record<string, unknown>) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[key] = toIntIfNeeded(value);
    return acc;
  }, {} as Record<string, unknown>);
};

export const getSingleNode = <T extends object = {}>(record: neo4j.Record): AppNode<T> => {
  const obj = record.get(0);
  const props = makeJSObject(obj.properties);

  // TODO: bad type cast
  return {
    ...props,
    id: obj.identity.toInt(),
    label: obj.labels[0], // TODO: support multiple labeled node,
  } as AppNode<T>;
};

export const getSingleRelationship = <T extends object = {}>(record: neo4j.Record): AppRelationship<T> => {
  const obj = record.get(0);
  const props = makeJSObject(obj.properties);

  // TODO: bad type cast
  return {
    ...props,
    id: obj.identity.toInt(),
    relationship: obj.type,
    source: obj.start.toInt(),
    target: obj.end.toInt(),
  } as AppRelationship<T>;
};
