import * as neo4j from 'neo4j-driver';

export const returnFirstOrNull = (records: neo4j.Record[]) => {
  if (records.length < 1) {
    return null;
  }

  const values = Array.from(records.values());
  const value = values[0];

  return value.get(value.keys[0]);
};
