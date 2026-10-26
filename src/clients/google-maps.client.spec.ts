import { HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { GoogleMapsClient } from './google-maps.client'

const client = new GoogleMapsClient({ getOrThrow: () => 'x' } as unknown as ConfigService)

const googleReplies = (body: object) => {
  global.fetch = jest.fn().mockResolvedValue({ json: () => Promise.resolve(body) })
}

const errorOf = (promise: Promise<unknown>) =>
  promise.then(
    () => {
      throw new Error('deveria ter falhado')
    },
    (error: { getStatus: () => number; code?: string }) => ({ status: error.getStatus(), code: error.code }),
  )

describe('GoogleMapsClient: cota diária do google', () => {
  it.each([
    ['rota', () => client.getRouteWithAlternatives('a', 'b'), { routes: [] }],
    ['elevação', () => client.getElevationFromPolyline('_p~iF~ps|U_ulLnnqC'), { results: [] }],
    ['trânsito', () => client.getTrafficStatus('a', 'b'), { rows: [] }],
  ])('%s: OVER_QUERY_LIMIT vira 503 GOOGLE_QUOTA_EXCEEDED', async (_, call, empty) => {
    googleReplies({ status: 'OVER_QUERY_LIMIT', error_message: 'daily quota', ...empty })
    expect(await errorOf(call())).toEqual({
      status: HttpStatus.SERVICE_UNAVAILABLE,
      code: 'GOOGLE_QUOTA_EXCEEDED',
    })
  })

  it('OVER_DAILY_LIMIT (teto definido no console) também vira cota', async () => {
    googleReplies({ status: 'OVER_DAILY_LIMIT', routes: [] })
    expect(await errorOf(client.getRouteWithAlternatives('a', 'b'))).toEqual({
      status: HttpStatus.SERVICE_UNAVAILABLE,
      code: 'GOOGLE_QUOTA_EXCEEDED',
    })
  })

  it('rota inexistente continua 404, sem virar 502', async () => {
    googleReplies({ status: 'ZERO_RESULTS', routes: [] })
    expect(await errorOf(client.getRouteWithAlternatives('a', 'b'))).toEqual({
      status: HttpStatus.NOT_FOUND,
      code: 'GOOGLE_ROUTES_NOT_FOUND',
    })
  })

  it('chave recusada vira 502', async () => {
    googleReplies({ status: 'REQUEST_DENIED', error_message: 'denied', results: [] })
    expect(await errorOf(client.getElevationFromPolyline('_p~iF~ps|U_ulLnnqC'))).toEqual({
      status: HttpStatus.BAD_GATEWAY,
      code: undefined,
    })
  })
})
