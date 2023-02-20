/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import axios from 'axios'
const { convert } = require('html-to-text')

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.get('/subjects', async () => {
  const response = await axios(
    'https://en.wikipedia.org/w/api.php?action=parse&page=Outline_of_academic_disciplines&format=json'
  )

  const mainCategories = response.data.parse.sections.map((s) => s.line)

  return {
    // data: response.data,
    codes: convert(response.data.parse.text['*'], {
      baseElements: { selectors: ['li'] },
    })
      .replace(/(\r\n|\n|\r)/gm, '')
      .replace(/\*/g, '')
      .match(/\[(.*?)\]/g),
    labels: convert(response.data.parse.text['*'], {
      baseElements: { selectors: ['li'] },
    })
      .replace(/(\r\n|\n|\r)/gm, '')
      .replace(/\*/g, '')
      .match(/\[(.*?)\]/g)
      .map((s: string) => s.split('/').map((str) => str.replace(']', ''))[2])
      .map((s) => (s ? s.replace('_', ' ') : s)),
  }
})
