import { parse } from 'csv-parse';
import fs from 'node:fs/promises';

export async function readCsvFile() {
  const filePath = new URL('../../tasks.csv', import.meta.url);

  const parser = await fs.readFile(filePath, 'utf-8').then(data => parse(Buffer.from(data)))
  let tasks = ''
  let count = 0

  process.stdout.write('start\n')

  for await (const record of parser) {
    if (count > 0) {
      fetch('http://localhost:3333/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: record[0],
          description: record[1]
        })
      })
    }
    count++
  }
  
  process.stdout.write('...done\n')
}

readCsvFile()